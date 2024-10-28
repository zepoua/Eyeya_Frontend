import React, { useState, } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableHighlight, ActivityIndicator, Alert, Button, RefreshControl } from 'react-native';
import StarRating from 'react-native-star-rating';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { Dimensions } from 'react-native';

const Recherche = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offInternet, setOffInternet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  screenHeight = Dimensions.get('window').height;

  const get = async () => {
      const getPosition = async () => {
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 15000 }
          );
        });
      };
    
      // Tentative de récupération de la position avec une limite de tentatives
      let position = null;
      let attempts = 0;
      const maxAttempts = 5; // Nombre maximal de tentatives
    
      while (position === null && attempts < maxAttempts) {
        try {
          position = await getPosition();
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        } catch (error) {
          if (position === null && attempts === 4) {
            Alert.alert('Impossible de récupérer la position. Veuillez activer votre localisation.');
            // position.coords.latitude = 6.11
            // position.coords.longitude = 1.3
            // const { latitude, longitude } = position.coords;
            // setCurrentLocation({ latitude, longitude });
            setLoading(false);
            setOffInternet(true);
          }
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 2 secondes entre les tentatives
        }
      }

    if (position !== null) {
      setSearchText('')
      const apiUrl = `${apiConfig.apiUrl}/index_global`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(initialData => {
          setData(initialData);
          setFilteredData(initialData);
        })
        .catch(error => {
          setOffInternet(true)
        }).finally(() => setLoading(false));
    }
  }

  useFocusEffect(
    React.useCallback(() => {
     get()
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      get();
      setRefreshing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    get();
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredData(data);
    } else {
        const apiUrl = `${apiConfig.apiUrl}/global_search?search=${searchText}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(filtered => setFilteredData(filtered))
          .catch(error => {
            setOffInternet(true)
          });
    }
  };
  
  const details =  (professionalId) => {
    navigation.navigate('Details', {latitude: currentLocation.latitude, longitude: currentLocation.longitude, professionalId: professionalId});
  };

  const renderProfessionalItem = ({ item }) => (
      <View style={styles.profsContainer}>
        <TouchableHighlight
          onPress={() => details(item.id)}
          activeOpacity={0.8}
          underlayColor="#EFF7F6E5"
          style={styles.touchableHighlight}
        >
          <View style={[styles.profs, { height: screenHeight / 6 }]}>
            <Image
              source={{ uri: `${apiConfig.imageUrl}/${item.image1}` }}
              style={{
                width: '100%',
                height: '50%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
            <View style={styles.text_view}>
            <Text style={styles.text}>{`${item.nom_entreprise.substring(0, 15)}`}...</Text>
              <Text style={styles.text}>{item.domaine?.domaine_lib ?? `${item.domaine_lib.substring(0, 15)}`}...</Text>
              <View style={{ marginTop: 15, marginBottom: 10 }}>
                <StarRating
                  disabled
                  starSize={15}
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
            style={{height: 40, borderColor: '#3792CE', borderWidth: 2, margin: 10, padding: 5, borderRadius: 18,}}
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
          <Text style={{ textAlign: 'center', color:'black', fontSize: 14 }}>
            Aucun résultat trouvé
          </Text>
          <Image
            source={require('../assets/images/search.png')}
            style={{ width: 100, height: 100 }}
          />
        </View>
      ) : loading ? ( // Utiliser l'état loading pour afficher un indicateur de chargement
        <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#3792CE" />
          <Text style={{color:'black'}}>chargement...</Text>
        </View>
      ) : offInternet ? (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
          <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
        </View>
      ) : (
      <View style={{ left:3 }}>
        <FlatList
          data={filteredData}
          renderItem={renderProfessionalItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3792CE" // Couleur de la flèche de rafraîchissement (optionnel)
            />
          }
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
    marginRight:3, 
    marginBottom:3,
    borderWidth:0.3,
    width:'32%',
    borderRadius:10,
    borderColor:'gray'
  },
  
  profs:{
    backgroundColor: 'white',
  },
  
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  text:{
    fontSize: 12,
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