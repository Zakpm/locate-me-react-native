import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { useDispatch } from 'react-redux';
import { addNickname } from '../reducers/user';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState('');

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handlePress = () => {
    if (!nickname || !nickname.trim()) {
      // On vérifie que le nickname n'est pas vide ou rempli d'espaces
      return;
    }
    navigation.navigate('TabNavigator');
    dispatch(addNickname(nickname)); // On dispatch l'action addNickname avec le nickname en paramètre pour l'ajouter au state user du store
    setNickname('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={require('../assets/home-image.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Locate Me</Text>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        onChangeText={(value) => setNickname(value)}
        value={nickname}
      />
      <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
        <Text style={styles.textButton}>Go to map</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Pacifico_400Regular',
    letterSpacing: 2,
  },
  input: {
    width: '80%',
    borderBottomColor: '#B733D0',
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginTop: 30,
    fontSize: 17,
  },
  button: {
    backgroundColor: '#B733D0',
    width: '80%',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
  textButton: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
