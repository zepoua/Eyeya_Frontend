import React, { useState,} from 'react';
import { View, TextInput, ActivityIndicator, Text, Image, StyleSheet, TouchableHighlight, FlatList, Button, RefreshControl, PermissionsAndroid, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiConfig from '../services/config';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({navigation}) => {
  const [domaine, setDomaine] = useState([]);
  const [nbre_users, setNbreUsers] = useState('');
  const [nbre_domaines, setNbreDomaines] = useState('');
  const [nbre_discussions, setNbreDiscussions] = useState('');
  const [filteredDomaine, setFilteredDomaine] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [offInternet, setOffInternet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState();
  const screenHeight = Dimensions.get('window').height;


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Accès à votre localisation',
          message: 'Eyeya souhaite utiliser vos coordonnées GPS',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await get();
        await getData();
      } else {
        Alert.alert('Veuillez autoriser l\'utilisation de la localisation pour utiliser l\'application');
      }
    } catch (err) {
      console.warn('Erreur de demande de permission:', err);
    }
  };

  const get = async () => {
    // Fonction pour obtenir la position géographique
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
          setLoading(false);
          setOffInternet(true);
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause de 2 secondes entre les tentatives
      }
    }
  
     if(position !== null) {
      try{
        const storedData = await AsyncStorage.getItem('formDataToSend');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const apiUrl = `${apiConfig.apiUrl}/domaine/${parsedData.id}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          setDomaine(data.liste_domaines);
          setFilteredDomaine(data.liste_domaines);
          setNbreUsers(data.users);
          setNbreDomaines(data.domaines);
          setNbreDiscussions(data.discussions);
        }
      } catch (error) {
        setOffInternet(true);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const getData = async () => {
    const storedData = await AsyncStorage.getItem('formDataToSend');
    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      if (Object.keys(parsedData).length > 6) {
        const apiUrl1 = `${apiConfig.apiUrl}/notation/${parsedData.user_id}`;
        fetch(apiUrl1)
          .then((response) => response.json())
          .then((data) => {
            if (data.moyenne_notations === null) {
              setRating('0');
            } else {
              setRating(data.moyenne_notations);
            }
          })
          .catch((error) => {
          });
      }
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      get();
      getData();
    }, [])
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      get();
      getData();
      setRefreshing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    get();
    getData();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredDomaine(domaine);
    } else {
        const apiUrl = `${apiConfig.apiUrl}/search_domaine?search=${searchText}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(filtered => setFilteredDomaine(filtered))
        .catch((error) => {
          setOffInternet(true)
        });
      }
  };

  const recherche = (domaine_id) => {
    const domaine_data = { currentLocation, domaine_id }; // Passer un objet avec les propriétés correctes
    navigation.navigate('UserParDomaine', { domaine_data });
  };    
  
  const renderItem = ({ item }) => {
    return(
      <View style={styles.profsContainer}>
        <TouchableHighlight
          onPress={() => recherche(item.id)}
          activeOpacity={0.8}
          underlayColor="#EFF7F6E5">
          <View style={styles.domaines}>
            <View style={{alignItems:'center'}}>
              <Image source={{uri: `${apiConfig.imageUrl}/${item.icone}`}} style={styles.circleImage} />
            </View>
            <View style={styles.text_view}>
              <Text style={styles.text}>{`${item.domaine_lib}`} </Text>
              <Text style={styles.text2}>{`${item.nombre_users}`} Professionnel(s)  </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%',  height:screenHeight/4, alignItems:'center', justifyContent:'center'}}>
        <Swiper 
          autoplay={true}
          autoplayTimeout={7}
          style={{height: '100%',}} 
          dotStyle={{ width: 8, height: 8, backgroundColor: '#5F6666', margin: 3 }}
          activeDotStyle={{ width: 8, height: 8, backgroundColor: '#0B79A5', margin: 3 }}>              
          <View style={styles.slide}>
              <Image
                source={require('../assets/images/test1.jpeg')}
                style={styles.image}
                resizeMode='contain'
              />
          </View>
          <View style={styles.slide}>
              <Image
                source={require('../assets/images/test2.jpg')}
                style={styles.image}
                resizeMode='contain'
              />
          </View>
        </Swiper>
      </View>
      <View style={{margin:10}}>
        <View style={{ width: '100%', height: screenHeight/9, borderRadius:10, }}>
          <View style={[styles.content, { backgroundColor: '#3792CE' }]}>
            <View style={{flexDirection:'row', padding:20, gap:10}}>
              <View style={{flexDirection:'column', gap:10, width:'50%'}}>
                <View style={{flexDirection:'row', gap:5}}>
                  <Icon name="supervisor-account" size={18} color="#FFFFFFE5" style={{marginRight:10,}}/>
                  <Text style={styles.tableau_bord}>Professionnels : {nbre_users}</Text>
                </View>
                <View style={{flexDirection:'row', gap:5}}>
                  <Icon name="domain" size={18} color="#FFFFFFE5" style={{marginRight:10,}}/>
                  <Text style={styles.tableau_bord}>Domaines : {nbre_domaines}</Text>
                </View>
              </View>
              <View style={{flexDirection:'column', gap:10, width:'50%'}}>
                <View>                
                  {rating && (
                  <StarRating
                    disabled
                    starSize={15}
                    maxStars={5}
                    rating={parseFloat(rating)}
                    fullStarColor={'#FDE03A'}
                    halfStarColor={'#F59C17'}
                    emptyStarColor= {'white'}
                  /> 
                  )}
                </View>
                <View style={{flexDirection:'row', gap:5}}>
                  <MaterialCommunityIcons name="chat" size={18} color="#FFFFFFE5" style={{marginRight:10,}}/>
                  <Text style={styles.tableau_bord}>Discussions : {nbre_discussions}</Text>
                </View>
              </View>
            </View>
        </View>
      </View>
        <View>
            <TextInput
              style={{height: 40, borderColor: '#3792CE', borderWidth: 2, marginTop: 15, padding: 5, borderRadius: 18,}}
              placeholder="Recherchez un domaine..."
              onChangeText={handleSearch}
              value={searchText}/>
          </View>
      </View>

        {loading ? (
          <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#3792CE" />
            <Text style={{color:'black'}}>chargement...</Text>
          </View>
        ) : offInternet ? (
          <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
            <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
          </View>
        ) : (
          <View>
            {searchText.trim() !== '' && filteredDomaine.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 250, }}>
                <Text style={{ textAlign: 'center', color:'black', fontSize: 14 }}>
                  Aucun résultat trouvé
                </Text>
                <Image source={require('../assets/images/search.png')} style={{ width: 100, height: 100 }} />
              </View>
            ) : (
              <View style={{marginBottom:350}}>
                <FlatList
                  data={filteredDomaine}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
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
        )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  image: {
    width: '100%',
    height: '100%',
    borderWidth:1
  },

  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tableau_bord:{
    color:'white',
    fontSize:12,
    textAlign:'center'
  }, 

  content: {
    width: '100%',
    height: '100%',
    borderRadius:10
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  text1:{
    color:'black',
    fontSize:24,
    fontWeight:'bold'
  },

  profsContainer: {
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    //backgroundColor:'black',
    flex:1,
    paddingBottom:5,
    paddingTop:5
  },

  domaines:{
    flexDirection: 'column',
  },

  text_view:{
    flexDirection: 'column',
    width:'100%',

  },
  text: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign:'center'
    
  },
  text2: {
    color: 'black',
    fontSize: 10,
    textAlign:'center'
  },
  
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

});
export default Home;