import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, ActivityIndicator, Text, Image, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiConfig from '../services/config';
import Geolocation from '@react-native-community/geolocation';
import { Dimensions } from 'react-native';


const Home = ({navigation}) => {
  const [domaine, setdomaine] = useState([]);
  const [filteredDomaine, setFilteredDomaine] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout de l'état loading

  //const screenWidth = Dimensions.get('window').width;
  //const itemWidth = (screenWidth - 30) / 2; // 30 est la somme des marges et espaces

  useFocusEffect(
    React.useCallback(() => {
      const apiUrl = `${apiConfig.apiUrl}/domaine`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(initialData => {
        setdomaine(initialData);
        setFilteredDomaine(initialData);
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error))
      .finally(() => setLoading(false));
    }, [])
  );
  
  const handleSearch = (text) => {
    setSearchText(text);

    // Effectuez une requête à votre API pour obtenir les données filtrées
    if (text.trim() === '') {
      // Si le champ de recherche est vide, affichez les données initiales
      setFilteredDomaine(domaine);
    } else {
      try {
        const apiUrl = `${apiConfig.apiUrl}/search_domaine?search=${searchText}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(filtered => setFilteredDomaine(filtered))
      } catch (error) {
        console.log('Erreur lors de la requête API :', error);
      }
      // Sinon, effectuez une recherche
      }
  };

  const recherche = async (domaine_id) => {
    try {
      //console.log('Avant getCurrentPosition');
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
  
      //console.log('Position récupérée:', position);
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
  
      //console.log('currentLocation mis à jour:', currentLocation);
  
      const domaine_data = [{ latitude, longitude }, domaine_id];
      //console.log(domaine_data)
      navigation.navigate('UserParDomaine', { domaine_data });
    } catch (error) {
      console.log('Erreur:', error.message);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  };
  
  
  const renderItem = ({ item }) => {
    return(
    <View style={styles.profsContainer}>
            <TouchableHighlight
              onPress={() => recherche(item.id)}
              activeOpacity={0.8}
              underlayColor="#EFF7F6E5">
              <View style={styles.domaines}>
                <View>
                  <Image source={require('../assets/images/test1.jpeg')} style={styles.circleImage} />
                </View>
                <View style={styles.text_view}>
                  <Text style={styles.text}>{`${item.domaine_lib}`}</Text>
                  <Text style={styles.text2}>{`${item.nombre_users}`} Professionnels   </Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
    );
          
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={{height: 40, borderColor: '#9B1126', borderWidth: 2, margin: 10, padding: 5, borderRadius: 18,}}
          placeholder="Rechercher..."
          onChangeText={handleSearch}
          value={searchText}/>
      </View>

      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#288A10" style={{ marginTop: 20 }} />
        </View>
      ) : (
        <View style={{alignItems: 'flex-start'}}>
          {searchText.trim() !== '' && filteredDomaine.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 250,
              }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                Aucun résultat trouvé
              </Text>
              <Image source={require('../assets/images/search.png')} style={{ width: 100, height: 100 }} />
            </View>
          ) : (
            <FlatList
              data={filteredDomaine}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Couleur de fond
  },

/**
 *  borderRadius: 50,
    margin: 5,
    width: itemWidth, // Largeur dynamique
    backgroundColor: 'white',
    shadowColor: '#DABB0B',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10, */  

  profsContainer: {
    borderRadius: 50,
    margin: 10,
    backgroundColor:'white',
    shadowColor: '#DABB0B',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
  },

  domaines:{
    flexDirection: 'row',
  },
  text_view:{
    flexDirection: 'column',
    marginLeft:5,
  },

  text: {
    color: '#130758',
    fontWeight: 'bold',
    fontSize: 17,
    flexWrap: 'nowrap', // Empêche le texte de passer à la ligne
  },
  text2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    flexWrap: 'nowrap', // Empêche le texte de passer à la ligne
  },
  
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

});
export default Home;