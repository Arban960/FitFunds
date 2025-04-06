import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, SafeAreaView, Button } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/firebase.config";
import { Link, router, useLocalSearchParams } from "expo-router";

const LogInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {goal} = useLocalSearchParams()

  // Handle login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if(!userCredential.user.emailVerified) {
        Alert.alert("Error","Please verify your email before you can proceed")
      } else {
        Alert.alert("Success", "Logged in successfully!");
        if (goal == "") {
          const id = userCredential.user.uid
          router.push({pathname:"/SetGoal", params:{id}})
        } else {
          router.push("/(tabs)")
        }
      }
    } catch (error: any) {
      Alert.alert("Error", "Incorrect email or password.");
    }
  };

  return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <Text className="text-6xl font-bold mb-6 text-center">Welcome to</Text>
      <Text className="text-6xl font-bold mb-6 text-center" style={{
        color:"green",
      }}>FitFunds</Text>
      {/* Email Input */}
      <View className = "bg-gray flex-row">
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={"gray"}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>
      

      {/* Password Input */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={"gray"}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        className="w-full bg-green-500 p-4 rounded-lg mb-2"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Log In</Text>
      </TouchableOpacity>

      {/* Sign Up Button */}
      <Link
      href={"/Register"}
      style={{
        color:"green"
      }}
      >
        <Text className="text-xl">Register instead</Text>
      </Link>
    </View>
    
    
  );
};

export default LogInScreen;
