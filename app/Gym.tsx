import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { Text } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebase.config';
const Gym = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState({
    latitude: 41.33212412715377, // Default fallback (Tirana, Albania)
    longitude: 19.801682374771605,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const {id} = useLocalSearchParams()

  const submit = async () => {
    try {
        const docRef = doc(FIRESTORE_DB, "users", id);
        await updateDoc(docRef, {
          gymLatitude: location?.latitude,
          gymLongitude: location?.longitude,
        });
        console.log("Field added successfully");
        router.push("/(tabs)")
      } catch (error) {
        console.error("Error adding field:", error);
      }
  }
  useEffect(() => {
    (async () => {
      // 1. Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        // 2. Get current position
        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High, // Request high accuracy
        });

        // 3. Update both location and region states
        setLocation(userLocation.coords);
        
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        console.log('Current location:', userLocation.coords);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Error fetching location: ");
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
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
                <Text className='text-white font-bold text-2xl'>Locate your gym</Text>
                ),          
              headerStyle: { backgroundColor: 'green' },
              
            }}
          />
    <View className='flex-1'>
      {errorMsg ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{errorMsg}</Text>
        </View>
      ) : (
        <MapView 
          style={{width:"100%", height:"90%"}}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              draggable
              coordinate={selectedLocation ? selectedLocation : region}
              title="Gym"
              onDragEnd={(event) => {handleMapPress}}
            />
          )}
        </MapView>
      )}
      <TouchableOpacity className="w-full bg-green-500 p-4 rounded-lg mb-2 justify-center" style={{height:"10%"}}
      onPress={submit}
      >
    <Text className="text-white text-2xl font-bold text-center">Submit</Text>
    </TouchableOpacity>
    </View>
    </>
  );
};

export default Gym;

const styles = StyleSheet.create({});