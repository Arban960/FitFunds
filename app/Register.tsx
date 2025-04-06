import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, SafeAreaView, Button, Pressable } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebase.config";
import { Link, router, Stack } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("")
  const [name, setName] = useState("")
  const [last, setLast] = useState("")
  // Handle sign up
  const handleSignUp = async () => {
    // if (!(email && password && confirm && name && last)){
    //   Alert.alert("Error","Please fill in the required fields")
    // }
    // else if (password != confirm) {
    //   Alert.alert("Passwords are not matching")
    // } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        await setDoc(doc(FIRESTORE_DB, "users", userCredential?.user.uid), {
          name:name,
          last:last,
          goal:0,
          money:0,
          current:0
        });
        sendEmailVerification(userCredential.user)
          .then(() => {
                    Alert.alert("Verification", "A verification link has been sent to your email");
          })
        const goal = "";
        router.push({"pathname":"/Login", "params":{goal}})
      } catch (error: any) {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    //}
    
  };

  return (
    <>
    <Stack.Screen
        options={{
            headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <Text style={{ color: 'white', marginRight: 15 }}>Back</Text>
                </Pressable>
              ),
            headerTitle: () => (
            <Text className='text-white font-bold text-2xl'>{"Register"}</Text>
            ),          
          headerStyle: { backgroundColor: 'green' },
          
        }}
      />
        <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <Text className="text-5xl text-black font-bold mb-6">Welcome</Text>

      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Name*"
        placeholderTextColor={"gray"}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Last name*"
        placeholderTextColor={"gray"}
        value={last}
        onChangeText={setLast}
      />
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Email*"
        placeholderTextColor={"gray"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />


      {/* Password Input */}
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg bg-white"
        placeholder="Password*"
        placeholderTextColor={"gray"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="w-full p-4 mb-4 border text-black border-gray-300 rounded-lg bg-white"
        placeholder="Confirm password*"
        placeholderTextColor={"gray"}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {/* Login Button */}
      
      
      {/* Sign Up Button */}
      <TouchableOpacity
        className="w-full bg-green-500 p-4 rounded-lg mb-2"
        onPress={handleSignUp}
      >
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>

    </View>
    
    </>
  );
};

export default LoginScreen;
