import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebase.config';

const SetGoal = () => {
  const [times, setTimes] = useState("");
  const [money, setMoney] = useState("")
  const {id} = useLocalSearchParams()
  const handleNext = async () => {
    if (times && money) {
      try {
        const userRef = doc(FIRESTORE_DB, "users", id);
        await updateDoc(userRef, {
          money: Number(money),
          goal:Number(times)
        });
        console.log("Field updated successfully");
        router.push({pathname:"/Gym", params:{id}})
      } catch (error) {
        console.error("Error updating field:", error);
      }
    } else {
      Alert.alert("Error", "Please fill in the required fields")
    }
    }
  
  return (
    <>
    <Stack.Screen
            options={{
              headerShown:false
            }}></Stack.Screen>
    <View className="flex-1 justify-center bg-gray-100 p-6">
          <View className='items-center'>
          <Text className="text-5xl text-black font-bold mb-6">Set a goal!</Text>
          </View>
          <Text className="text-black font-light mb-2 ml-1">How often are you going to the gym?</Text>
          <TextInput
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
            placeholder="x/week*"
            value={times}
            onChangeText={setTimes}
            placeholderTextColor={"gray"}
          />
          <Text className="text-black font-light mb-2 ml-1">How much are you "betting" on it?</Text>

          <TextInput
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
            placeholder="Dollars*"
            placeholderTextColor={"gray"}
            value={money}
            onChangeText={setMoney}
          />
          <TouchableOpacity
                  className="w-full bg-green-500 p-4 rounded-lg mb-2"
                  onPress={handleNext}
                >
                  <Text className="text-white text-center font-semibold">Next</Text>
                </TouchableOpacity>
          </View></>

  )
}

export default SetGoal

const styles = StyleSheet.create({})