import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { addPlace, removePlace } from '../reducers/user';

export default function PlacesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); // On récupère le state user du store

  const [city, setCity] = useState(''); // On initialise le state city avec une string vide

  const handleSubmit = () => {
    // On crée une fonction qui va être appelée au clic sur le bouton "Add"
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`) // On fait une requête à l'API adresse avec la ville entrée par l'utilisateur
      .then((res) => res.json()) // On récupère la réponse de l'API au format json
      .then((data) => {
        // On récupère les données de l'API dans la variable data
        const result = data.features[0]; // On récupère le premier résultat de la recherche (le plus pertinent)

        const newCity = {
          // On crée un objet newCity avec les données de l'API qui nous intéressent
          latitude: result.geometry.coordinates[1].toFixed(3), // On arrondit les coordonnées à 3 chiffres après la virgule
          longitude: result.geometry.coordinates[0].toFixed(3),
          name: result.properties.name,
        };

        dispatch(addPlace(newCity)); // On dispatch l'action addPlace avec l'objet newCity en paramètre pour l'ajouter au state user du store (et donc à notre liste de lieux)
        setCity(''); // On remet le state city à une string vide
      });
  };

  const places = user.places.map((place, i) => {
    return (
      <View key={i} style={styles.placeContainer}>
        <View>
          <Text>{place.name}</Text>
          <Text>
            LAT : {place.latitude} LON : {place.longitude}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.trash}
          onPress={() => dispatch(removePlace(place.name))}
        >
          <FontAwesome name="trash-o" size={25} color="#B733D0" />
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s Places</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New city"
          onChangeText={(value) => setCity(value)}
          value={city}
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 30,
    marginTop: 20,
  },
  inputContainer: {
    width: '80%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 28,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 45,
  },
  input: {
    width: '70%',
    borderBottomColor: '#B733D0',
    borderBottomWidth: 1,
    paddingBottom: 4,
    fontSize: 17,
  },
  button: {
    backgroundColor: '#B733D0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  textButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    width: '90%',
  },
  placeContainer: {
    backgroundColor: '#fff',
    width: '80%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    marginBottom: 20,
  },
  trash: {
    marginLeft: 50,
  },
});
