import { StyleSheet, Text, View, Image, FlatList, TouchableHighlight, TouchableOpacity,TextInput, Modal, ActivityIndicator, Button, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles
import apiConfig from '../services/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from './test';
import { Dimensions } from 'react-native';


const UserParDomaine = ({route, navigation}) => {
  
  const [data, setData] = useState([]);
  const [offInternet, setOffInternet] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { domaine_data } = route.params;
  const { latitude, longitude } = domaine_data.currentLocation;
  const domaine_id = domaine_data.domaine_id;

  screenHeight = Dimensions.get('window').height;

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
      console.log(error);
      setOffInternet(true)
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    fetchData();
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredData(data);
    } else {
      const apiUrl = `${apiConfig.apiUrl}/search?search=${searchText}&domaine_id=${domaine_id}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(filtered => setFilteredData(filtered))
        .catch(error => {
          console.log(error);
          setOffInternet(true)
        });
    }
  };

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  const handleFilterApply = (value) => {
    setLoading(true); // Ajoutez cette ligne pour activer le chargement pendant la requête
    const apiUrl = `${apiConfig.apiUrl}/user?domaine_id=${domaine_id}&latitude=${latitude}&longitude=${longitude}&distance=${value}`;
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
      .catch(error => {
        console.log(error);
        setOffInternet(true)
      })
      .finally(() => {
        setLoading(false);
        setModalVisible(false);
      });
  };

  const radio_props = [
    { label: 'Inférieur ou egale à 10 km', value: '1' },
    { label: 'Entre 10 km et 20 km', value: '2' },
    { label: '5 etoiles', value: '3' },
    { label: '4 etoiles', value: '4' },
    { label: '3 etoiles', value: '5' },   
    { label: 'Reinitialiser', value: '6' },

  ];

  const details = async (professionalId) => { 
    navigation.navigate('Details', { latitude, longitude, professionalId });
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
            <Text style={styles.text1}>{`${item.formattedDistance}`}</Text>
            <View style={{ marginTop: 20, marginBottom: 10 }}>
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
      <View style={{flexDirection:'row', width:'100%', paddingRight:10, marginBottom:5}}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#3792CE',
            borderWidth: 2,
            margin: 10,
            padding: 5,
            borderRadius: 18,
            width:'83%'
          }}
          placeholder={'Rechercher...'}
          onChangeText={handleSearch}
          value={searchText}
          editable={filteredData.length > 0}/>
          <TouchableOpacity style={{marginTop: 10, width:'14%'}}  onPress={handleFilterPress}>
            <Icon name="filter" size={25} color={'#242322'}/>
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
        <ActivityIndicator size="large" color="#3792CE"/>
        <Text style={{color:'black'}}>chargement...</Text>
      </View>
    ) : offInternet ? (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
        <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
      </View>
    ) : filteredData.length === 0 ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', color:'black', fontSize: 14 }}>
          Aucun Professionnel dans ce domaine.
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
              handleFilterApply(value);
            }}
            formHorizontal={false}
          />
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
    marginTop: 15,
  },

  text1:{
    color: '#791414',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
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
