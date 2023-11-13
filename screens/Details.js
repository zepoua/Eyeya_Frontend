// Details.js
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import CommentModal from './Commentaires';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';


const Details = ({ route, navigation }) => {
  const [professionals, setProfessionals] = useState([]);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout de l'état loading

  const jsonData =  route.params;
    // Extraction des données
    const domaineData = jsonData.domaine_data;
    const latitude = domaineData[0].latitude;
    const longitude = domaineData[0].longitude;
    const professionalId = domaineData[1];
    console.log(professionalId)

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const apiUrl = `${apiConfig.apiUrl}/detail_user?user_id=${professionalId}&latitude=${latitude}&longitude=${longitude}`;
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
          console.log(professionals);
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        } finally {
          setLoading(false);
          console.log(loading);

        }
      };
      
      // Appelez fetchData une fois
      fetchData();
      
    }, [])
  );

  const handleRating = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formDataToSend');
  
      if (storedData !== null) {
        // Convertir la chaîne JSON en objet JavaScript
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
  
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
            console.error('Erreur :', error.message);
          });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }    setRatingModalVisible(false);
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
    
          // Naviguer vers une autre page avec les détails de l'interlocuteur
          navigation.navigate('DetailMessages', {
            clientId: clientID,
            interlocuteurId: professionals.clientId,
          });
        }
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    };
    

  return (
    <View style={{flex: 1, marginBottom: 10, top:0, backgroundColor:'#FFFFFF'}}>
      <Modal visible={isRatingModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, width: 300 }}>
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
      <ScrollView>
        <View style={{flex:1, flexDirection: 'colunn', marginTop: 0 }}>
          <View style={{ width: '100%', height: 300, alignItems:'center', justifyContent:'center'}}>
            <Swiper style={styles.wrapper} showsButtons={true}>
              {images.map((image, index) => (
                <View key={index} style={styles.slide}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.image}
                      resizeMode='contain'
                    />
                  ) : (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#288A10" />
                    </View>
                  )}
                </View>
              ))}
            </Swiper>
          </View> 
         <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', marginBottom: 20,}}>
            <View style={{flex:1, flexDirection: 'row', marginBottom: 25, left: 15, top: 20}}>
              <TouchableOpacity onPress={() => setCommentModalVisible(true)} style={{marginRight:10}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Icon name="comment" size={30} color={'#1B0272'} /></View>
                <Text style={{textAlign:'left'}}>commenter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDiscussionPress()} style={{marginRight:10}}>
                <Icon name="comments" size={30} color={'#D81111'}/>
                <Text  style={{textAlign:'left'}}>Chatter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRatingModalVisible(true)}>
                <Icon name="star" size={30} color={'#FDE03A'}/>
                <Text  style={{textAlign:'left'}}>Noter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', right: 25, top:23 }}>
              <StarRating
                disabled
                starSize={30}
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
          <View style={{flex: 1, justifyContent: 'center', marginBottom: 10}}>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#088828', textAlign:'center'}}>M/Mme/Mlle  {`${professionals.nom} ${professionals.prenom}`}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#791414', textAlign:'left', top:10}}>Situe a {`${professionals.formattedDistance}`}</Text>
              </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.text}>Domaine</Text>
              <Text style={styles.text_data}>{professionals.domaine?.domaine_lib ?? professionals.domaine_lib}</Text>
            </View>
            <View>
              <Text style={styles.text}>Nom de l'Entreprise</Text>
              <Text style={styles.text_data}>{`${professionals.nom_entreprise}`}</Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 5}}>
            <Text style={styles.text}>Description de l'Entreprise</Text>
            <Text style={styles.text_data}>{`${professionals.description}`}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 5}}>
            <Text style={styles.text}>Qualifications Acquises </Text>
            <Text style={styles.text_data}>{`${professionals.qualification}`}</Text>
            <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 5}}>
            <Text style={styles.text}>Experiences de Travail</Text>
            <Text style={styles.text_data}>{`${professionals.experience}`}</Text>
            <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 5}}>
            <Text style={styles.text}>Coordonnees Personnelles</Text>
            <Text style={styles.text_data}>{`${professionals.email}`}, +228 {`${professionals.telephone1}`}{professionals.telephone2 ? `, +228 ${professionals.telephone2}` : ''}, {`${professionals.adresse}`}</Text>
          </View>
          </View>
          </View>
        </View>
      </ScrollView>
      <CommentModal isVisible={isCommentModalVisible} onClose={() => setCommentModalVisible(false)} userId={professionals.id}/>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    marginLeft: 18,
    marginRight: 18,

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
  },
  text:{
    fontSize: 20,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color:'black',
    marginTop: 5,
    marginBottom: 0,
  }
})
