import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
//import { ScrollView } from 'react-native-windows';

const Home = () => {
  
  const [professionals, setProfessionals] = useState([]);
  // État pour stocker la valeur sélectionnée dans la liste déroulante
//const [selectedDomaine, setSelectedDomaine] = useState('');

  // Effectuez une requête fetch pour obtenir les données des domaines
useEffect(() => {
    // Remplacez cette URL par l'URL de votre API qui fournit les données des domaines
    const apiUrl = 'http://192.168.1.242:8000/api/user';

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setProfessionals(data);
    })
    .catch((error) => {
        console.error('Erreur lors de la requête :', error);
    });
}, []);




  return (
    <View style={styles.container}>
      <ScrollView>
          {professionals.map((professional) => (
        <View key={professional.id}>
          <Image source={{ uri:'https://reactjs.org/logo-og.png' }} style={{ width: 50, height: 50 }} />
          <Text>{`${professional.nom} ${professional.prenom}`}</Text>
          <Text>{`Entreprise: ${professional.nom_entreprise}`}</Text>
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Couleur de fond
  },
});
