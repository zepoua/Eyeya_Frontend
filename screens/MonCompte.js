import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MonCompte = ({navigation}) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les données stockées localement
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formDataToSend');

        if (storedData !== null) {
          // Convertir la chaîne JSON en objet JavaScript
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    // Appeler la fonction de récupération des données
    fetchUserData();
  }, []);

  const reset = async () =>{
      try {
         await AsyncStorage.removeItem("formDataToSend");
          navigation.navigate('Start')
      } catch (error) {
        alert(error)
      }
  }

  return (
    <View>
      {userData ? (
        <>
          <Text>Bienvenue, {userData.prenom} {userData.nom}!</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Téléphone: {userData.telephone}</Text>
          <Text>Identifiant: {userData.id}</Text>
          {/* Ajoutez d'autres éléments de la page d'accueil ici */}
        </>
      ) : (
        <Text>Aucune donnée utilisateur trouvée.</Text>
      )}

          <Button
            onPress={reset}
            title="supprimer"
            accessibilityLabel="Learn more about this purple button"
          />    
  </View>
  );
};

export default MonCompte;
