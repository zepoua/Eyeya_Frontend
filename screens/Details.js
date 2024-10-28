// Details.js
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator, RefreshControl } from 'react-native';
import CommentModal from './Commentaires';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import CustomModal from './test';

const Details = ({ route, navigation }) => {
  const [professionals, setProfessionals] = useState([]);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [offInternet, setOffInternet] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const {latitude, longitude, professionalId} =  route.params;

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formDataToSend');
      const parsedData = JSON.parse(storedData)
      let apiUrl;
      if (!parsedData.user_id || parsedData.user_id !== professionalId) {
        apiUrl = `${apiConfig.apiUrl}/detail_user?user_id=${professionalId}&latitude=${latitude}&longitude=${longitude}`;
      } else {
        apiUrl = `${apiConfig.apiUrl}/vues?user_id=${professionalId}&latitude=${latitude}&longitude=${longitude}`;
      }

      const response = await fetch(apiUrl);
      const userData = await response.json();
  
      const formattedDistance = userData.distance < 1000
        ? `${userData.distance.toFixed(2)} m`
        : `${(userData.distance / 1000).toFixed(2)} km`;
  
      const formattedUser = {
        ...userData,
        formattedDistance,
      };
  
      setProfessionals(formattedUser);
    } catch (error) {
      setOffInternet(true)
    } finally {
      setDataLoaded(false);
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
      fetchData();
      setRefreshing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setDataLoaded(true);
    fetchData();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRating = async () =>{      
    const storedData = await AsyncStorage.getItem('formDataToSend');
      setLoading(true)
      if (storedData !== null) {
        // Convertir la chaîne JSON en objet JavaScript
        const parsedData = JSON.parse(storedData);

        const formDataToSend = {
          user_id: professionalId,
          client_id: parsedData.id, // Utilisez parsedData au lieu de userData ici
          nbre_etoiles: rating,
        };
  
        const apiUrl = `${apiConfig.apiUrl}/enreg_notation`;
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend),
        };
  
        // Effectuez la requête fetch vers votre API
        fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            setProfessionals({
              ...professionals,
              moyenne_notations : data
            })
            setRating(0)       
          })
          .catch((error) => {
            setError('Verifiez votre connexion')
            setModalVisible(true)
          }).finally(()=>{
            setRatingModalVisible(false)
            setLoading(false)
          })
      }
  };

  const images = [];
    if (professionals.image1 !== null) {
      images.push(professionals.image1);
    }
    if (professionals.image2 !== null) {
      images.push(professionals.image2);
    }
    if (professionals.image3 !== null) {
      images.push(professionals.image3);
    }

    const handleDiscussionPress = async () => {
      try {
        // Récupérer les données stockées dans AsyncStorage
        const storedData = await AsyncStorage.getItem('formDataToSend');
    
        if (storedData !== null) {
          // Convertir la chaîne JSON en objet JavaScript
          const parsedData = JSON.parse(storedData);
    
          // Obtenir l'ID du client à partir des données analysées
          const clientID = parsedData.id;

          if(parsedData.user_id != professionals.id){
            navigation.navigate('DetailMessages', {
              clientId: clientID,
              interlocuteurId: professionals.clientId,
            });
          }
             
        }
      } catch (error) {
      }
    };    

  return (
    <View style={{flex: 1, marginBottom: 10, top:0, backgroundColor:'#FFFFFF'}}>
      <Modal visible={isRatingModalVisible} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, width: '80%' }}>
              <Text style={{ fontSize: 18, marginBottom: 10, textAlign:'center', fontWeight:'bold', color:'black' }}>Donnez une note :</Text>
              <StarRating
                starSize={40}
                maxStars={5}
                rating={rating}
                fullStarColor={'#FDE03A'}
                selectedStar={(rating) => setRating(rating)}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity onPress={() => setRatingModalVisible(false)} style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRating} style={{ padding: 10, backgroundColor: '#FDE03A', borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Valider</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
      <Modal transparent visible={loading} animationType="slide">
        <View style={{flex: 1,  justifyContent: 'center', alignItems: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
          <ActivityIndicator size="large" color="#FFFFFF" />          
        </View>
        </Modal>
      {dataLoaded ? (
        <View style={styles.loadingContainer}>          
          <ActivityIndicator size="large" color="#3792CE" />
          <Text style={{color:'black'}}>chargement...</Text>
        </View>
      ): offInternet ? (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
          <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
        </View>
      ) : (
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3792CE"
            />
          }>
        <View style={{flex:1, flexDirection: 'colunn', marginTop: 0 }}>
          <View style={{ width: '100%', height: screenHeight/3, alignItems:'center', justifyContent:'center'}}>
            <Swiper style={styles.wrapper} showsButtons={true}>
              {images.map((image, index) => (
                <View key={index} style={styles.slide}>
                  {image ? (
                    <Image
                      source={{ uri: `${apiConfig.imageUrl}/${image}` }}
                      style={styles.image}
                      resizeMode='contain'
                    />
                  ) : (
                    <View style={styles.loadingContainer}>
                       <ActivityIndicator size="large" color="#3792CE" />
                      <Text style={{color:'black'}}>chargement...</Text>
                    </View>
                  )}
                </View>
              ))}
            </Swiper>
          </View> 
         <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', marginBottom: 20, height:'100%'}}>
            <View style={{flex:1, flexDirection: 'row', marginBottom: 25, left: 15, top: 20, height:'60%'}}>
              <TouchableOpacity onPress={() => setCommentModalVisible(true)} style={{marginRight:10}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Icon name="comment" size={30} color={'#1B0272'} /></View>
                <Text style={{textAlign:'left'}}>commenter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDiscussionPress()} style={{marginRight:10}}>
                <Icon name="wechat" size={30} color={'#D81111'}/>
                <Text  style={{textAlign:'left'}}>Chatter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRatingModalVisible(true)}>
                <Icon name="star" size={30} color={'#FDE03A'}/>
                <Text  style={{textAlign:'left'}}>Noter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', right: 25, top:25, height:'40%' }}>
              <StarRating
                disabled
                starSize={25}
                maxStars={5}
                rating={parseFloat(professionals.moyenne_notations)}
                fullStarColor={'#FDE03A'}
                halfStarColor={'#F59C17'}
              />

            </View>
            <View>
            </View>
          </View>
        </View>
        <View style={styles.text_view}>
          <View style={{flex: 1, justifyContent: 'center', marginBottom: 30}}>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#083188', textAlign:'center'}}>{`${professionals.nom} ${professionals.prenom}`}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#791414', textAlign:'center', top:15}}>Se trouve à {`${professionals.formattedDistance}`} de vous</Text>
              </View>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5, borderColor:'#C2BFBF' }}>
            <Text style={styles.text}>Nom de l'Entreprise</Text>
            <Text style={styles.text_data}>{`${professionals.nom_entreprise}`}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5, borderColor:'#C2BFBF' }}>
              <Text style={styles.text}>Domaine</Text>
              <Text style={styles.text_data}>{professionals.domaine?.domaine_lib ?? professionals.domaine_lib}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5, borderColor:'#C2BFBF' }}>
            <Text style={styles.text}>Description de l'Entreprise</Text>
            <Text style={styles.text_data}>{`${professionals.description}`}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5,  borderColor:'#C2BFBF'  }}>
            <Text style={styles.text}>Qualifications Acquises </Text>
            <Text style={styles.text_data}>{`${professionals.qualification}`}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5,  borderColor:'#C2BFBF'  }}>
            <Text style={styles.text}>Experiences de Travail</Text>
            <Text style={styles.text_data}>{`${professionals.experience}`}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10, borderBottomWidth:0.5,  borderColor:'#C2BFBF'  }}>
            <Text style={styles.text}>Coordonnees Personnelles</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Icon name="email" size={20} color={'#090342'} style={{left:15,top:5}}/>
              <Text style={styles.text_data1}>{`${professionals.email}`}</Text>
            </View>
            <View style={{flexDirection:'row',}}>
              <Icon name="phone" size={20} color={'#090342'} style={{left:15,top:5}}/>
              <Text style={styles.text_data1}>+228 {`${professionals.telephone1}`}{professionals.telephone2 ? `, +228 ${professionals.telephone2}` : ''}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Icon name="maps-home-work" size={20} color={'#090342'} style={{left:15,top:5}}/>
              <Text style={styles.text_data1}>{`${professionals.adresse}`}</Text>
            </View>
          </View>
        </View>
        </ScrollView>
      )}
      
      <CustomModal
        isVisible={isModalVisible}
        onClose={closeModal}
        message={error}
      />
      <CommentModal isVisible={isCommentModalVisible} onClose={() => setCommentModalVisible(false)} userId={professionals.id}/>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    marginLeft: 15,
    marginRight: 15,

  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  text_data:{
    fontWeight: 'normal',
    fontSize: 15,
    color: 'black',
    width: '100%',
    top:5,
    marginBottom:8
  },
  text_data1:{
    fontWeight: 'normal',
    fontSize: 14,
    color: 'black',
    width: '100%',
    left:25,
    top:5,
    marginBottom:8
  },
  text:{
    fontSize: 16,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color:'black',
    marginTop: 5,
  },
  input1:{
    width : '80%',
    borderBottomWidth: 0.5,
    borderColor:'gray',
  },
})
