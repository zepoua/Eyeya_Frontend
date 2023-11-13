import { StyleSheet, Text, View, Image, FlatList, TouchableHighlight, TouchableOpacity,TextInput, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles
import apiConfig from '../services/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Geolocation from '@react-native-community/geolocation';

const UserParDomaine = ({route, navigation}) => {
  
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true); // Ajout de l'état loading
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    
    const jsonData =  route.params;
    // Extraction des données
    const domaineData = jsonData.domaine_data;
    const latitude = domaineData[0].latitude;
    const longitude = domaineData[0].longitude;
    const domaine_id = domaineData[1];

    useFocusEffect(
      React.useCallback(() => {
        const fetchData = async () => {
          try {
            const apiUrl = `${apiConfig.apiUrl}/user?domaine_id=${domaine_id}&latitude=${latitude}&longitude=${longitude}`;
            const response = await fetch(apiUrl);
            const initialData = await response.json();
  
            const formattedUsers = initialData.map(user => {
              let formattedDistance;
  
              if (user.distance < 1000) {
                formattedDistance = user.distance.toFixed(2) + ' m';
              } else {
                formattedDistance = (user.distance / 1000).toFixed(2) + ' km';
              }
  
              return {
                ...user,
                formattedDistance,
              };
            });
  
            setData(formattedUsers);
            setFilteredData(formattedUsers);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchData(); // Appeler la fonction fetchData pour effectuer la requête initiale.
  
        // Le tableau de dépendances est vide car nous ne voulons exécuter cet effet qu'une seule fois lors du montage initial.
      }, [])
    );

    const handleSearch = (text) => {
        setSearchText(text);
    
       if (text.trim() === '') {
          setFilteredData(data);
        } else {
          try {
            const apiUrl = `${apiConfig.apiUrl}/search?search=${searchText}&domaine_id=${domaine_id}`;
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

    const handleFilterPress = () => {
      setModalVisible(true);
    };
  
    const handleFilterApply = () => {
      const apiUrl = `${apiConfig.apiUrl}/user?domaine_id=${domaine_id}&latitude=${latitude}&longitude=${longitude}&distance=${selectedFilter}`;
      
      fetch(apiUrl)
        .then(response => response.json())
        .then(initialData => {
          // Supposons que 'users' est votre tableau d'utilisateurs avec la distance renvoyée par le backend.
          const formattedUsers = initialData.map(user => {
            let formattedDistance;
    
            // Si la distance est inférieure à 1000 mètres, la formater en mètres avec deux chiffres après la virgule.
            if (user.distance < 1000) {
              formattedDistance = user.distance.toFixed(2) + ' m';
            } else {
              // Si la distance est supérieure ou égale à 1000 mètres, la convertir en kilomètres avec deux chiffres après la virgule.
              formattedDistance = (user.distance / 1000).toFixed(2) + ' km';
            }
    
            return {
              ...user,
              formattedDistance,
            };
          });
              setFilteredData(formattedUsers);
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error))
        .finally(() => setLoading(false));
      setModalVisible(false);
    };
  
  
    const radio_props = [
      { label: 'Inférieur ou egale à 10 km', value: '1' },
      { label: 'Entre 10 km et 20 km', value: '2' },
      { label: '5 etoiles', value: '3' },
      { label: '4 etoiles', value: '4' },
      { label: '3 etoiles', value: '5' },   
      { label: 'Reinitialiser', value: '6' },

    ];

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
              <Text style={styles.text1}>{`${item.formattedDistance}`}</Text>
              <View style={{ marginTop: 20, marginBottom: 13 }}>
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
        <View style={{flexDirection:'row'}}>
          <TextInput
            style={{
                height: 40,
                borderColor: '#9B1126',
                borderWidth: 2,
                margin: 10,
                padding: 5,
                borderRadius: 18,
                width:320
            }}
            placeholder={'Rechercher...'}
            onChangeText={handleSearch}
            value={searchText}
            editable={filteredData.length > 0}/>
          <TouchableOpacity style={{margin: 6}}  onPress={handleFilterPress}>
              <Icon name="star" size={30} color={'#FDE03A'}/>
              <Text  style={{textAlign:'left'}}>Filtrer</Text>
          </TouchableOpacity>
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
    ) : filteredData.length === 0 ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
          Aucun Professionnel dans ce domaine
        </Text>
        <Image
          source={require('../assets/images/search.png')}
          style={{ width: 100, height: 100 }}
        />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end', // Aligner le contenu en bas
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent pour un effet d'ombrage
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
            {/* Contenu du modal */}
            <RadioForm
              radio_props={radio_props}
              initial={-1}
              onPress={(value) => {
                setSelectedFilter(value);
              }}
              formHorizontal={false}
            />
            <TouchableOpacity onPress={handleFilterApply}>
              <Text style={{ color: '#8A5506', marginTop: 10 }}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </View>
  );
};

export default UserParDomaine;

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
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'gray',
    height: 320,
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
    marginTop: 10,
    marginBottom:15
  },
  text1:{
    color: '#791414',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom:10
  },
  touchableHighlight: {
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
