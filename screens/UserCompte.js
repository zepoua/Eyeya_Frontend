import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import { Alert } from 'react-native-windows';
import * as ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating';
import { useFocusEffect } from '@react-navigation/native';

const UserCompte = ({navigation}) => {

  const [clientData, setClientData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [domaines, setDomaines] = useState([]);
  const [rating, setRating] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formDataToSend');
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setClientData(parsedData);
          setEditedData(parsedData);
          
          const apiUrl1 = `${apiConfig.apiUrl}/notation/${parsedData.user_id}`;
          fetch(apiUrl1)
            .then((response) => response.json())
            .then((data) => {
              setRating(data.moyenne_notations);
            })
            .catch((error) => {
              console.error('Erreur lors de la requête1 :', error);
            });
  
          const apiUrl = `${apiConfig.apiUrl}/domaine`;
          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              setDomaines(data);
            })
            .catch((error) => {
              console.error('Erreur lors de la requête2 :', error);
            });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };  
    fetchData();
  }, []);
  
  

  const images = [];
    if (editedData.image2 !== null) {
      images.push(editedData.image2);
    }
    if (editedData.image3) {
      images.push(editedData.image3);
    }else{
      images.push(editedData.image1);
    }

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(clientData);
  };

  const handleChoosePhoto = (index) => {
    ImagePicker.launchImageLibrary(
        {
            title: 'Sélectionnez une image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        },
        (response) => {
            if (response.didCancel) {
                console.log('Annulé');
            } else if (response.error) {
                console.error('Erreur :', response.error);
            } else {
                switch (index) {
                    case 0:
                      const updatedData1 = { ...editedData, image1: response.assets[0].uri };
                      setEditedData(updatedData1);                        
                      break;
                    case 1:
                      const updatedData2 = { ...editedData, image2: response.assets[0].uri };
                      setEditedData(updatedData2);                        
                      break;
                    case 2:
                      const updatedData3 = { ...editedData, image3: response.assets[0].uri };
                      setEditedData(updatedData3);                        
                      break;
                    default:
                        break;
                }
            }
        }
    );
};
  
  const position = async () => {
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

    // Mettre à jour les données dans editedData avec latitude et longitude
      setEditedData(prevData => ({
      ...prevData,
      latitude: latitude,
      longitude: longitude,
    }));

      console.log('currentLocation mis à jour:', currentLocation);
    } catch (error) {
      console.log('Erreur:', error.message);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  };

  const handleSave = () => {
    const formDataToSend = {
      id:editedData.id,
      nom_entreprise:editedData.nom_entreprise,
      nom: editedData.nom,
      prenom: editedData.prenom,
      email: editedData.email,
      password: editedData.password,
      adresse: editedData.adresse,
      latitude: editedData.latitude,
      longitude: editedData.longitude,
      telephone1: editedData.telephone1,
      telephone2: editedData.telephone2,
      qualification: editedData.qualification,
      experience: editedData.experience,
      description: editedData.description,
      image1: editedData.image1,
      image2: editedData.image2,
      image3: editedData.image3,
      domaine_id: editedData.domaine_id,
    };

    const apiUrl = `${apiConfig.apiUrl}/user/${editedData.user_id}`;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      };
    
      // Effectuez la requête fetch vers votre API
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          if (data.status == 'success') {
            updateStoredData(editedData);
            setClientData(editedData);
            setIsEditing(false);
          } else {
            Alert.alert(data.message);
        }
        }).catch((error) => {
          console.error('Erreur :', error.message);
        });
  };

  const updateStoredData = async (data) => {
    try {
      await AsyncStorage.setItem('formDataToSend', JSON.stringify(data));
      console.log('Données stockées mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données stockées :', error);
    }
  };

  const handleChangeText = (key, value) => {
    // Update editedData when TextInput values change
    setEditedData(prevData => ({ ...prevData, [key]: value }));
  };

  return (
    <View style={styles.Container}>

        <Text style={styles.titre}>Informations Personnelles</Text>
        <ScrollView>
          <View style={{flex:1, flexDirection:'column'}}>
            <View style={{ flex:1, width: '100%', height: 170, alignItems:'center', justifyContent:'center',}}>
              <Swiper 
                style={{height: 170, position:'static'}} 
                showsButtons={true}
                dotStyle={{ width: 8, height: 8, backgroundColor: '#6C37CE', margin: 3 }}
                activeDotStyle={{ width: 8, height: 8, backgroundColor: '#FDE03A', margin: 3 }}
              >              
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
            <View style={{left:-50,top:-50,flexDirection: 'row', justifyContent:'center' }}>
                {editedData.image1 && (
                  <Image
                    source={{ uri: editedData.image1 }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      borderColor: '#053D37E5',
                      borderWidth: 1,
                    }}
                  />
                )}
                <View style={{flexDirection:'column', top:40, left:30, justifyContent:'center', alignSelf:'center', }}>
                  <Text style={{textAlign:'center',  fontSize: 20, fontFamily: 'Cochin', fontWeight: 'bold', color:'black', marginBottom:5 }}>{editedData.nom_entreprise}</Text>
                    <StarRating
                      disabled
                      starSize={23}
                      maxStars={5}
                      rating={parseFloat(rating)}
                      fullStarColor={'#FDE03A'}
                      halfStarColor={'#F59C17'}
                    /> 
                </View>
            </View>
            <View style={{flexDirection: 'column',top: 0, marginBottom: 15,}}>

              <View style={{justifyContent: 'center', alignItems:'center', top:0, marginBottom:15,}}>
                  {!isEditing && (
                  <TouchableHighlight 
                  onPress={() => handleEdit()}
                  style={{backgroundColor:'#3792CE', height:40, width:'80%', borderRadius:50, justifyContent:'center', alignItems:'center',}}>
                    <Text style={{ color:'white', fontSize:18}}>Modifier mon Profil</Text>
                  </TouchableHighlight>
                )}
              </View>

              <View style={{left:10,top:20}}>
              <Text style={styles.libelle}>Nom de l'Entreprise</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('nom_entreprise', text)}
                  value={editedData.nom_entreprise} editable={isEditing}/>

                <Text style={styles.libelle}>Nom</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('nom', text)}
                  value={editedData.nom} editable={isEditing}/>
                  
                <Text style={styles.libelle}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('prenom', text)}
                  value={editedData.prenom} editable={isEditing}/>

                <Text style={styles.libelle}>email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('email', text)}
                  value={editedData.email} editable={isEditing}/>

                {isEditing &&(
                  <View>
                  <Text style={styles.libelle}>Mot de Passe</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChangeText('password', text)}
                    placeholder='votre nouveau de passe'
                    editable={isEditing}/></View>
                )}

                <Text style={styles.libelle}>Adresse</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('adresse', text)}
                  value={editedData.adresse} editable={isEditing}/>

                <Text style={styles.libelle}>Numero de telephone</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('telephone1', text)}
                  value={editedData.telephone1} editable={isEditing}/>

                <Text style={styles.libelle}>Numero de telephone 2</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('telephone2', text)}
                  value={editedData.telephone2} editable={isEditing}/>
                
                <Text style={styles.libelle}>Vos Qualifications</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('qualification', text)}
                  value={editedData.qualification} editable={isEditing}/>

                <Text style={styles.libelle}>Vos Experiences</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('experiences', text)}
                  value={editedData.experience} editable={isEditing}/>

                <Text style={styles.libelle}>Description de votre Entreprise</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('description', text)}
                  value={editedData.description} editable={isEditing}
                  multiline={true}/>
                
                {isEditing && (
                  <View>
                    <Text style={styles.libelle}> Domaine d'activite</Text>
                    <Picker
                      style={styles.input}
                      selectedValue={editedData.domaine_id.toString()} // Définir la valeur par défaut
                      onValueChange={(itemValue, itemIndex) => {
                        // Mettre à jour editData lors du changement de valeur
                      setEditedData(prevData => ({
                      ...prevData,
                      domaine_id: parseInt(itemValue, 10),}));
                    }}>
                      <Picker.Item label="Sélectionnez un domaine" value="" />
                      {domaines.map((domaine) => (
                        <Picker.Item
                          style={styles.input}
                          key={domaine.id}
                          label={domaine.domaine_lib}
                          value={domaine.id.toString()}
                        />
                        ))}
                      </Picker>

                    <Text style={styles.libelle}> Modifier votre Geolocalisation</Text>
                    <TouchableHighlight 
                      onPress={() => position()}
                      style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:20}}>
                    <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                    </TouchableHighlight>

                    <Text style={styles.libelle}> Modifier votre photo de Profil</Text>
                    <TouchableHighlight 
                      onPress={() => handleChoosePhoto(0)}
                      style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:20}}>
                    <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                    </TouchableHighlight>

                    <Text style={styles.libelle}> Modifier votre photo de Couverture</Text>
                    <TouchableHighlight 
                      onPress={() => handleChoosePhoto(1)}
                      style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:20}}>
                    <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                    </TouchableHighlight>

                    <Text style={styles.libelle}>Autre Photo (optionnel) </Text>
                    <TouchableHighlight 
                      onPress={() => handleChoosePhoto(2)}
                      style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:20}}>
                    <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                    </TouchableHighlight>
                  </View>
              )}
              </View>
              {isEditing && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', top:40, marginBottom:50}}>
                  <TouchableHighlight 
                    onPress={() => handleSave()}
                    style={{backgroundColor:'#37CE37', height:45, width:'45%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                    <Text style={{ color:'white', fontSize:18}}>Enregistrer</Text>
                  </TouchableHighlight>
                  <TouchableHighlight 
                    onPress={() => handleCancel()}
                    style={{backgroundColor:'#810A0A', height:45, width:'45%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                    <Text style={{ color:'white', fontSize:18}}>Annuler</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex:1,
    backgroundColor:'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    borderBottomWidth:1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  image: {
    height: '100%',
    width: '100%',
    },
  libelle: {
    fontSize: 18,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color:'black',
    top:5,
    left:10,
  },
  titre: {
    fontSize: 24,
    fontFamily: 'algerian',
    fontWeight: 'bold',
    color:'darkblue',
    textAlign:'center',
    paddingTop: 8,
    paddingBottom: 15,
  },
  input:{
    height: 40,
    width : 350,
    borderBottomWidth: 0.5,
    borderColor:'gray',
    margin:10,
    color:'black',
    fontSize: 16,
  },

  button:{
    color: 'black',
  }
})



export default UserCompte;
