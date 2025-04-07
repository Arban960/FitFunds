import datetime
from flask import Flask, request, jsonify
from alpaca_trade_api import REST
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

API_KEY = ""
SECRET_KEY = ""

#create connection to paper trading api
#https://api.alpaca.markets for live trading
def get_alpaca_client():
    return REST(API_KEY, SECRET_KEY, 'https://paper-api.alpaca.markets', api_version='v2')

#automatic investment if u don't meet workout quota
@app.route('/auto_invest<investment_amount>', methods=['GET']) #when u send request to url path the function runs (POST http://your-server.com/log_workout)
def auto_invest(investment_amount):
    alpaca = get_alpaca_client()
    try:
        alpaca.submit_order(
            symbol='VOO', #tracks S&P500
            notional=investment_amount, #amount in dollars to invest, can be fractional shares
            side='buy',
            type='market',
            time_in_force='day' #order expires at the end of trading day if not filled
        )
        return jsonify({'status': 'Investment placed', 'amount': investment_amount}), 200 #OK
    except Exception as e:
        return jsonify({'status': 'Investment failed', 'error': str(e)}), 400 #Bad Request


#total amount invested
@app.route('/total_invested', methods=['GET'])
def total_invested():

    alpaca = get_alpaca_client()
    try:
        orders = alpaca.list_orders(status='all') #get all the orders regardless of completion
        total = sum(float(o.notional) for o in orders if o.symbol == 'VOO' and o.side == 'buy')
        #filter out the orders by the exact amount and type established by user 
        return jsonify({'total_invested': round(total, 2)}), 200
    except Exception as e:
        return jsonify({'status': 'Failed to fetch investments', 'error': str(e)}), 400


#total earnings
@app.route('/total_earned', methods=['GET'])
def total_earned():
    alpaca = get_alpaca_client()

    try:
        #get all completed buy orders
        orders = alpaca.list_orders(status='filled')
        buy_orders = [o for o in orders if o.side == 'buy' and o.symbol == 'VOO'] #specifically auto ones
        
        #calculate total amount invested ($per share * qty bought)
        total_cost_basis = sum(float(o.filled_avg_price) * float(o.filled_qty) for o in buy_orders)

        #get current market value of VOO position
        positions = alpaca.list_positions() #all active stock positions
        voo_position = next((p for p in positions if p.symbol == 'VOO'), None)

        if not voo_position: #no unrealized gains or losses
            return jsonify({'total_earned': 0.00, 'note': 'No current VOO holdings'}), 200

        current_value = float(voo_position.market_value)

        #calculate earnings (value of stock - $spent to buy)
        total_earnings = current_value - total_cost_basis

        return jsonify({
            'total_earned': round(total_earnings, 2),
            'current_value': round(current_value, 2),
            'total_cost_basis': round(total_cost_basis, 2)
        }), 200

    except Exception as e:
        return jsonify({'status': 'Failed to fetch accurate earnings', 'error': str(e)}), 400

#run flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
