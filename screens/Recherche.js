import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const Recherche = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout de l'état loading
  

  useFocusEffect(
    React.useCallback(() => {
      const apiUrl = `${apiConfig.apiUrl}/index_global`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(initialData => {
          setData(initialData);
          setFilteredData(initialData);
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error))
        .finally(() => setLoading(false));
    }, [])
  );

  
  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredData(data);
    } else {
      try {
        const apiUrl = `${apiConfig.apiUrl}/global_search?search=${searchText}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(filtered => setFilteredData(filtered))
          .catch(error => {
            console.error('Erreur lors de la requête API :', error);
          });
      } catch (error) {
        console.log('Erreur lors de la requête API :', error);
      }
    }
  };
  
  const details = async (professionalId) =>{ 

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
  
      const domaine_data = [{ latitude, longitude }, professionalId];
      //console.log(domaine_data)
      navigation.navigate('Details', { domaine_data });
    } catch (error) {
      console.log('Erreur:', error.message);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }

  }

  const renderProfessionalItem = ({ item }) => (
    
      <View style={styles.profsContainer}>
        <TouchableHighlight
          onPress={() => details(item.id)}
          activeOpacity={0.8}
          underlayColor="#EFF7F6E5"
          style={styles.touchableHighlight}
        >
          <View style={styles.profs}>
            <Image
              source={{ uri: item.image1 }}
              style={{
                width: '100%',
                height: 150,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            />
            <View style={{ flex: 1, alignItems: 'center', marginTop: -60 }}>
              <Image
                source={{ uri: item.image2 }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderColor: '#053D37E5',
                  borderWidth: 1
                }}
              />
            </View>
            <View style={styles.text_view}>
              <Text style={styles.text}>{`${item.nom} ${item.prenom}`}</Text>
              <Text style={styles.text}>{`${item.nom_entreprise}`}</Text>
              <Text style={styles.text}>{item.domaine?.domaine_lib ?? item.domaine_lib}</Text>
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <StarRating
                  disabled
                  starSize={23}
                  maxStars={5}
                  rating={parseFloat(item.moyenne_notations)}
                  fullStarColor={'#FDE03A'}
                  halfStarColor={'#F59C17'}
                />            
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={{
            height: 40,
            borderColor: '#9B1126',
            borderWidth: 2,
            margin: 10,
            padding: 5,
            borderRadius: 18,
          }}
          placeholder={'Rechercher...'}
          onChangeText={handleSearch}
          value={searchText}
          editable={true}
        />
      </View>

      {searchText.trim() !== '' && filteredData.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 250,
          }}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
            Aucun résultat trouvé
          </Text>
          <Image
            source={require('../assets/images/search.png')}
            style={{ width: 100, height: 100 }}
          />
        </View>
      ) : loading ? ( // Utiliser l'état loading pour afficher un indicateur de chargement
      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#288A10" style={{ marginTop: 20 }} />
      </View>
  ) : (
    <View style={{ left:3 }}>
      <FlatList
        data={filteredData}
        renderItem={renderProfessionalItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
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

  profsContainer: {
    width: '48%',
    marginLeft : 3,
    marginRight:3, 
    marginTop:3,
    marginBottom:7
  },
  
  profs:{
    borderWidth: 2,
    borderRadius: 15,
    borderColor: 'gray',
    height: 300,
    backgroundColor: 'white',
  },
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
    height: 60,
  },

  text:{
    fontWeight: 'bold',
    fontSize: 15,
    color: '#062153',
    textAlign: 'center',
    marginTop: 15
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  touchableHighlight: {
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default Recherche;