import { Tabs, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/firebase.config';
import LogInScreen from '../Login';
import { doc, DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import SetGoal from '../SetGoal';



export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<DocumentData | null>(null);

    useEffect(() => {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user)
      })

    }, [])
    if (!user || !user.emailVerified) {
      return <LogInScreen />;
    } 
    const {goal} = useLocalSearchParams();
    console.log(goal)
    if (goal == "0") {
      return <SetGoal/>
    }
  return (
    <Tabs
    
      screenOptions={{
        headerShown: false,
        
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: 'green'
        },

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabelStyle:{
            color:"#9acf97",
          },
          tabBarIcon:({ color })  => <IconSymbol size={28} name="house.fill" color={"#9acf97"} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        
        options={{
          title: 'Profile',
          tabBarLabelStyle:{
            color:"#9acf97",
          },
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={"#9acf97"} />,
        }}
      />
    </Tabs>
  );
}
