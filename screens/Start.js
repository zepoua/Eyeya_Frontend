import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Alert } from 'react-native-windows';

const Start = ({ navigation }) => {
 
  const load = async() =>{
    try {
      let user = await AsyncStorage.getItem('formDataToSend');
      if (user !== null) {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CreateClient' }],
          });
        }, 1000);
      }
    } catch (error) {
      Alert.alert('error')
    }    
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 3000);

    // Assurez-vous de nettoyer le timer lorsque le composant est démonté
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
      source={require('../assets/images/load.jpg')} style={styles.logo} />
      <View style={styles.contentContainer}>
          <Text style={styles.bottomText}>WELCOME TO MY APP.....</Text>
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    width: '100%', // Utilisez '100%' pour couvrir toute la largeur de l'écran
    height: '100%', // Utilisez '100%' pour couvrir toute la hauteur de l'écran
    resizeMode: 'cover',
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Positionne le contenu en bas de l'écran
    alignItems: 'center',
    marginBottom: 40, // Ajustez la marge selon vos besoins
  },
  bottomText: {
    fontSize: 18,
    color: 'white', // Couleur du texte
  },

});

export default Start;
