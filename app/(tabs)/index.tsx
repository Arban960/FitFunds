import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Progress from 'react-native-progress';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/firebase.config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import Location from "expo-location"
import { Link } from 'expo-router';


const index = () => {
  const [current, setCurrent] = useState(1);
  const [goal,setGoal] = useState(1);
  const [dollars, setDollars] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [cost, setCost] = useState(0.0);
  const [invested, setInvested] = useState(0.0)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()

  const handleSignOut = async () => {
    await signOut(FIREBASE_AUTH)
  }
  useEffect(() => {
    // Set up auth state listener
    const fetchData = async () => {
      try{
          const API_URL = 'http://128.61.48.70:5000';
          const response = await fetch(API_URL+"/total_invested");
          const earnedResponse = await fetch(API_URL+"/total_earned")
          const json = await response.json();
          const earnedJson = await earnedResponse.json()
          setInvested(json.total_invested);
          setCost(earnedJson.current_cost)
    }catch{
      console.log("ERROR")
    }}

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      setUser(user);
      
      if (user) {
        // Only run these if we have a user
        try {
          const docRef = doc(FIRESTORE_DB, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const lastReset = docSnap.data().lastReset?.toDate() || new Date(0);
          const now = new Date();
          const msPerDay = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(
          lastReset.getFullYear(), 
          lastReset.getMonth(), 
          lastReset.getDate()
        );
        const utc2 = Date.UTC(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate()
        );
        const daysSinceReset = Math.floor((utc2 - utc1) / msPerDay);

        // Check if ≥7 days AND current < goal
        if (daysSinceReset >= 7 && docSnap.data().current < docSnap.data().goal) {
          const API_URL = 'http://128.61.48.70:5000';
          await fetch(API_URL+"/auto_invest"+dollars);

          await updateDoc(docRef, {
            current: 0,
            lastReset: serverTimestamp() // Uses server time to avoid client clock issues
          });
        }
            setGoal(docSnap.data().goal);
            setCurrent(docSnap.data().current);
            setDollars(docSnap.data().dollars);
          }
          
          // Get location after we have user data
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
          
          const userLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setLatitude(userLocation.coords.latitude);
          setLongitude(userLocation.coords.longitude);
          
         
        } catch (err) {
          console.error("Error in user data flow:", err);
        }
      }
    });
    fetchData() 
    return () => unsubscribe();
  }, []);

    const submit = async () => {
      try {
        if(user?.uid){
          const docRef = doc(FIRESTORE_DB, "users", user?.uid);
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {

            
              const latitude_current = latitude
              const longitude_current = longitude
      
            const latitude_gym = docSnap.data().gym_latitude
            const longitude_gym = docSnap.data().gym_longitude
      
            const toRad = x => x * Math.PI / 180;
        
            const R = 6371; // Earth's radius in km
            const dLat = toRad(latitude_current - latitude_gym);
            const dLon = toRad(longitude_current - longitude_gym);
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(latitude_gym)) * Math.cos(toRad(latitude_current)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c; // Distance in km
      
            if (distance < 0.1) {
              Alert.alert("Success")
              updateDoc(docRef, {
                current:current+1
              })
            } else{
              Alert.alert("Error", "You don't seem to be at the gym")
            }
          }
        }
  
  
      
      }catch (err) {
        console.log("ERROR")
      }    
    }
  return (
    <View className='flex-1 items-center bg-gray-200 p-6'>
      
      <Text className='text-5xl font-bold text-center mt-20 rounded-md'
      style={{
        color: "green",
        fontFamily: "Copperplate"
      }}
      >TRACK YOUR PROGRESS</Text>
      <View className='flex-row mt-20'>
      <Text className='text-2xl'>Workouts completed: </Text>
      <Text className='text-2xl'>{current}/{goal}</Text>
      </View>
      <Progress.Bar 
      width={"90%"}
      height={35}
      className='mt-2'
      progress={current/goal} 
      color='#197806'
    >
    </Progress.Bar>
    <View
    style={{
      width:"70%",
      height: "20%",
      borderWidth: 2,          // Border thickness
      borderColor: '#000000',  // Border color
      borderRadius: 8,         // Rounded corners
    }}
    className='justify-center items-center mt-20'
    >
    <Text className='text-2xl font-semibold'>Investment Summary</Text>
    <View className='flex-row mt-2'>
    <Text className='text-2xl' style={{textDecorationLine: "underline"}}>Total invested: </Text>
    <Text className='text-2xl'>${invested}</Text>
    </View>
    <View className='flex-row mt-2'>
    <Text className='text-2xl' style={{textDecorationLine: "underline"}}>Current value: </Text>
    <Text className='text-2xl'>${invested}</Text>
    </View>
    </View>
    

    <TouchableOpacity
            className="bg-green-500 p-4 rounded-lg mt-20 mb-2 "
            style={{
              width:"90%",
              borderWidth: 2,          // Border thickness
              borderColor: '#000000',  // Border color
              borderRadius: 8,         // Rounded corners
            }}
          >
            <Text className="text-white text-3xl text-center " onPress={submit}>I'M AT THE GYM</Text>
          </TouchableOpacity>
            
          <Button onPress={handleSignOut} title="Log out" color={"#2c9c31"}>
          </Button>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})