import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Alert } from 'react-native-windows';

const Start = ({ navigation }) => {
 
  const load = async() =>{
    try {
      let user = await AsyncStorage.getItem('formDataToSend');
      if (user !== null) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('CreateAccount');
      }
    } catch (error) {
      Alert.alert('error')
    }    
  }

  useEffect(() => {
    // Attendez quelques secondes (par exemple, 3 secondes) puis naviguez vers la page suivante
    const timer = setTimeout(() => {
      load();
    }, 3000);

    // Assurez-vous de nettoyer le timer lorsque le composant est démonté
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/start.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Couleur de fond
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain', // Ajustez la taille de l'image
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Couleur du texte
  },
});

export default Start;
