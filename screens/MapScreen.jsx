import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useEffect } from "react";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { addPlace } from "../reducers/user";

export default function MapScreen() {
  const dispatch = useDispatch();
  const places = useSelector((state) => state.user.value.places);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [longPressCoords, setLongPressCoords] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setLocation(location.coords);
          console.log(location);
        });
      }
    })();
  }, []);

  const handleLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLongPressCoords(coordinate); 
    setModalVisible(true);
  };

  const handleAddCity = () => {
    const newCity = {
      latitude: longPressCoords.latitude.toFixed(3),
      longitude: longPressCoords.longitude.toFixed(3),
      name: newCityName,
    };
    dispatch(addPlace(newCity));
    setModalVisible(false);
    setNewCityName(""); 
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: location ? location.latitude : 48.9772316,
          longitude: location ? location.longitude : 2.3114407,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{ flex: 1 }}
        mapType="hybrid"
        onLongPress={handleLongPress}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="My Location"
            pinColor="#fecb2d"
          />
        )}
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(place.latitude),
              longitude: parseFloat(place.longitude),
            }}
            title={place.name}
            pinColor="#fecb2d"
          />
        ))}
      </MapView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter le nom de la ville"
              value={newCityName}
              onChangeText={(text) => setNewCityName(text)}
            />
            <Pressable style={styles.button} onPress={handleAddCity}>
              <Text style={styles.textStyle}>Ajouter la ville</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: "#f44336",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
});
