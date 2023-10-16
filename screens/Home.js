import { StyleSheet, Text, View, Image, ScrollView, TouchableHighlight } from 'react-native';
import React, { useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles

const Home = ({navigation}) => {
  
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
        console.error('Erreur lors de la requête DE USER :', error);
    });
}, []);

const details = (professionalId) =>{ 
  navigation.navigate('Details', { professionalId });
}

  return (
    <View style={styles.container}>
        <ScrollView>
          {professionals.map((professional, index) => (
          <TouchableHighlight 
            key={index}
            onPress={() => details(professional.id)}
            activeOpacity={0.8} 
            underlayColor='#EFF7F6E5'>
            <View key={index} style={styles.profs}>
            <Image source={require('../assets/images/test1.jpeg')} style={{ width: 360, height: 200,  borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,}} />
            <View style={styles.text_view}>
              <View>
                <Text style={styles.text}>{`${professional.nom} ${professional.prenom}`}</Text>
                <Text style={styles.text}>{`${professional.domaine.domaine_lib}`}</Text>
              </View>
              <View>
                <Text style={styles.text}>{`${professional.nom_entreprise}`}</Text>
                <StarRating
                  disabled
                  starSize={23}
                  maxStars={5}
                  rating={professional.moyenne_notations}
                  fullStarColor={'#FDE03A'}
                  halfStar={'#494112'}/>             
              </View>
            </View>
          </View>
        </TouchableHighlight>
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
    backgroundColor: '#F4F7D6', // Couleur de fond
  },

  profs:{
    margin: 15,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 15,
    backgroundColor: 'white'

  },
  text_view:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
    height: 60,
  },
  
  text:{
    fontWeight: 'bold',
    fontSize: 17,
    color: '#062153',
    textAlign: 'center',
    marginBottom: 10
  }
});
