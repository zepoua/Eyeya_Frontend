import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableHighlight, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import * as ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating';
import Geolocation from '@react-native-community/geolocation';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserCompte = () => {

  const navigation = useNavigation();

  const [clientData, setClientData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [domaines, setDomaines] = useState([]);
  const [rating, setRating] = useState();
  const [vues, setVues] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const [isVisible, setVisible] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('formDataToSend');
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);          
          setEditedData(parsedData);
          setClientData(parsedData);
          const apiUrl1 = `${apiConfig.apiUrl}/notation/${parsedData.user_id}`;
          fetch(apiUrl1)
            .then((response) => response.json())
            .then((data) => {              
              setRating(data.moyenne_notations);
              setVues(data.vues);
            })
            .catch((error) => {
            });
  
          const apiUrl = `${apiConfig.apiUrl}/liste_domaines`;
          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              setDomaines(data);
            })
            .catch((error) => {
            });
            setDataLoaded(true)
        }
      } catch (error) {
      }
    };  
    fetchData();
  }, []);
  
  const images = [];
  if (editedData.image2) {
    images.push(editedData.image2.fileName);
  }
  if (editedData.image3 && editedData.image3.fileName) {
    images.push(editedData.image3.fileName);
  } else if(editedData.image1) {
    images.push(editedData.image1.fileName);
  }

  const handleEdit =  () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('')
    setEditedData(clientData);
  };

  const selectImage = (index) => {
    ImagePicker.launchImageLibrary(
      {
        title: 'Sélectionnez une image',
        storageOptions: {
          skipBackup: true,
          path: '',
        },
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          const { uri, fileName, type } = response.assets[0];
          let updatedData = { ...editedData }; // Copiez les données éditées actuelles
  
          switch (index) {
            case 0:
              updatedData = { ...updatedData, image1: { uri, fileName, type } };
              break;
            case 1:
              updatedData = { ...updatedData, image2: { uri, fileName, type } };
              break;
            case 2:
              updatedData = { ...updatedData, image3: { uri, fileName, type } };
              break;
            default:
              break;
          }
          setEditedData(updatedData);
        }
      }
    );
  };
  
  const position = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });

      const { latitude, longitude } = position.coords;
      setEditedData(prevData => ({
        ...prevData,
        latitude: latitude,
        longitude: longitude,
      }));
      setError('Position recuperee avec succes...')
      setModalVisible(true)
    } catch (error) {
      setError('Position non recuperee, verifiez votre connexion et reessayer.')
      setModalVisible(true)
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', editedData.user_id);
    formData.append('id', editedData.id);
    formData.append('nom_entreprise', editedData.nom_entreprise);
    formData.append('nom', editedData.nom);
    formData.append('prenom', editedData.prenom);
    formData.append('email', editedData.email);
    formData.append('password', editedData.password);
    formData.append('adresse', editedData.adresse);
    formData.append('latitude', editedData.latitude);
    formData.append('longitude', editedData.longitude);
    formData.append('telephone1', editedData.telephone1);
    formData.append('telephone2', editedData.telephone2);
    formData.append('qualification', editedData.qualification);
    formData.append('experience', editedData.experience);
    formData.append('description', editedData.description);
    formData.append('domaine_id', editedData.domaine_id);
    const Images = ['image1', 'image2', 'image3'];
    Images.forEach(imageKey => {
      if (editedData[imageKey] && editedData[imageKey].uri) {
        formData.append(imageKey, {
          uri: editedData[imageKey].uri,
          type: editedData[imageKey].type,
          name: editedData[imageKey].fileName,
          //randomParam: Math.random(), // Ajoutez un paramètre aléatoire
        });
      }
    });

    const apiUrl = `${apiConfig.apiUrl}/update_user`;
    const requestOptions = {
      method: 'POST',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    };
    
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'success') {
          setError(data.message);
          setModalVisible(true);
          updateStoredData(editedData);
          setClientData(editedData);
          setIsEditing(false);
        } else {
          setError(data.message);
          setModalVisible(true);        }
      }).catch((error) => {
        setError('Verifiez votre connexion')
        setModalVisible(true)
      }).finally(() => setLoading(false));
    };

  const updateStoredData = async (data) => {
    try {
      await AsyncStorage.setItem('formDataToSend', JSON.stringify(data));
    } catch (error) {
    }
  };

  const handleChangeText = (key, value) => {
    // Update editedData when TextInput values change
    setEditedData(prevData => ({ ...prevData, [key]: value }));
  };

  const logOut =  () => {
    AsyncStorage.removeItem('formDataToSend');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });  }

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeModal2 = () => {
    setVisible(false)
  };

  const onClose2 = () => {
    setVisible(false);
  };

  const Alert = ({ isVisible, onClose}) => {
    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor:'white'}]}>
            <Text style={{ color: 'black', fontWeight:'bold' }}>Voulez-vous vraiment vous deconnecter ?</Text>
            <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginTop: 16, width:'50%'}}>
              <TouchableOpacity onPress={(logOut)}>
                <Text style={{ color: '#1570D8', fontWeight:'bold'}}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose2}>
                <Text style={{ color: '#000000', fontWeight:'bold'}}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.Container}>
      {dataLoaded ? (
        <ScrollView>
          <View style={{flex:1, flexDirection:'column'}}>
            <View style={{ flex:1, width: '100%', height:screenHeight/4, alignItems:'center', justifyContent:'center',}}>
              {images &&(
                <Swiper 
                style={{height: '100%', position:'static', height:screenHeight/4}} 
                showsButtons={true}
                dotStyle={{ width: 8, height: 8, backgroundColor: '#6C37CE', margin: 3 }}
                activeDotStyle={{ width: 8, height: 8, backgroundColor: '#FDE03A', margin: 3 }}
              >              
                {images.map((image, index) => (
                  <View key={index}>
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
              )}
            </View>
            <View style={{paddingLeft:10, top:-50, flexDirection: 'row', alignItems:'center', width:'100%', justifyContent:'center'}}>
                {editedData.image1 && (
                  <Image
                    source={{ uri: `${apiConfig.imageUrl}/${editedData.image1.fileName}` }}
                    style={{
                      height: 100,
                      borderRadius: 50,
                      borderColor: '#053D37E5',
                      borderWidth: 1,
                      width:'25%'
                    }}
                  />
                )}
                <View style={{flexDirection:'column', top:40, justifyContent:'center', alignSelf:'center', width:'45%'}}>
                  <Text style={{textAlign:'center',  fontSize: 16, fontFamily: 'Cochin', fontWeight: 'bold', color:'black', marginBottom:5 }}>{editedData.nom}</Text>
                    <StarRating
                      disabled
                      starSize={23}
                      maxStars={5}
                      rating={parseFloat(rating)}
                      fullStarColor={'#FDE03A'}
                      halfStarColor={'#F59C17'}
                    /> 
                </View>
                <View style={{flexDirection:'column', top:40, justifyContent:'center', alignSelf:'center', width:'30%' }}>
                  <Text style={{textAlign:'center',  fontSize: 16, fontFamily: 'Cochin', fontWeight: 'bold', color:'black', marginBottom:5 }}>Vues</Text>
                  <Text style={{textAlign:'center',  fontSize: 16, fontFamily: 'Cochin', fontWeight: 'bold', color:'black', marginBottom:5 }}>{vues}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'column',top: 0, marginBottom: 15,}}>

            <View>
              {!isEditing && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', top:10, bottom:20, marginLeft:10, marginRight:10}}>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#7698F3'
                    onPress={() => handleEdit()}
                    style={{backgroundColor:'#3792CE', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center',}}>
                    <Text style={{ color:'white', fontSize:12}}>Modifier mon Profil</Text>
                  </TouchableHighlight>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#272727'
                    onPress={() => {setVisible(true)}}
                    style={{backgroundColor:'#000000', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center',}}>
                    <Text style={{ color:'white', fontSize:12}}>Deconnexion</Text>
                  </TouchableHighlight>
                </View>
              )}
              </View>
              <View style={{left:5,top:34}}>
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
                    placeholder='Votre nouveau mot de Passe'
                    onChangeText={(text) => handleChangeText('password', text)}
                    editable={isEditing}/></View>
                )}

                <Text style={styles.libelle}>Adresse</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('adresse', text)}
                  value={editedData.adresse} editable={isEditing}/>

                <Text style={styles.libelle}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.input}
                  inputMode='tel'
                  onChangeText={(text) => handleChangeText('telephone1', text)}
                  value={String(editedData.telephone1)} // Convertir en chaîne de caractères
                  editable={isEditing}
                />
                {editedData.telephone2 &&(
                  <View>
                    <Text style={styles.libelle}>Numéro de téléphone 2</Text>
                    <TextInput
                      style={styles.input}
                      inputMode='tel'
                      onChangeText={(text) => handleChangeText('telephone2', text)}
                      value={String(editedData.telephone2)} // Convertir en chaîne de caractères
                      editable={isEditing}
                    />
                  </View>
                )}
          
                <Text style={styles.libelle}>Vos Qualifications</Text>
                {!isEditing ?(
                  <View style={styles.input}>
                    <Text style={{color:'black', alignSelf:'flex-start', top:5}}>{editedData.qualification}</Text>
                  </View>
                ):(
                  <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('qualification', text)}
                  value={editedData.qualification} editable={isEditing}
                  multiline={true}/>
                )}
                <Text style={styles.libelle}>Vos Experiences</Text>
                {!isEditing ?(
                  <View style={styles.input}>
                    <Text style={{color:'black', alignSelf:'flex-start', top:5}}>{editedData.experience}</Text>
                  </View>
                ):(
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('experiences', text)}
                  value={editedData.experience} editable={isEditing}
                  multiline={true}/>
                )}
                <Text style={styles.libelle}>Description de votre Entreprise</Text>
                {!isEditing ?(
                  <View style={styles.input}>
                    <Text style={{color:'black', alignSelf:'flex-start', top:5}}>{editedData.description}</Text>
                  </View>
                ):(
                  <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChangeText('description', text)}
                  value={editedData.description} editable={isEditing}
                  multiline={true}/>
                )}
                
                {isEditing && (
                  <View>
                    <Text style={styles.libelle}> Domaine d'activite</Text>
                    <View style={styles.input1}>
                      <Picker
                        style={styles.input2}
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
                            key={domaine.id}
                            label={domaine.domaine_lib}
                            value={domaine.id.toString()}
                          />
                          ))}
                      </Picker>
                    </View>

                    <View style={styles.input1}>
                      <Text style={styles.libelle}> Modifier votre Geolocalisation</Text>
                      <TouchableHighlight 
                        onPress={() => position()}
                        style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                      <View style={{flexDirection:'row'}}>
                        <MaterialCommunityIcons name="google-maps" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                        <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                      </View>
                      </TouchableHighlight>
                    </View>
                    <View style={styles.input1}>
                      <Text style={styles.libelle}> Modifier votre photo de Profil</Text>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                        <TouchableHighlight 
                          onPress={() => selectImage(0)}
                          style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                          <View style={{flexDirection:'row'}}>
                            <Icon name="add-a-photo" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                            <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                          </View>
                        </TouchableHighlight>
                        <Text style={{width:'55%', fontSize:12, top:10}}>
                          {editedData.image1.fileName ? `  ${editedData.image1.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.input1}>
                      <Text style={styles.libelle}> Modifier votre photo de Couverture</Text>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                        <TouchableHighlight 
                          onPress={() => selectImage(1)}
                          style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                          <View style={{flexDirection:'row'}}>
                            <Icon name="add-a-photo" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                            <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                          </View>
                        </TouchableHighlight>
                        <Text style={{width:'55%', fontSize:12, top:10}}>
                          {editedData.image2.fileName ? `  ${editedData.image2.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.input1}>
                      <Text style={styles.libelle}>Autre Photo (optionnelle) </Text>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                        <TouchableHighlight 
                          onPress={() => selectImage(2)}
                          style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                          <View style={{flexDirection:'row'}}>
                            <Icon name="add-a-photo" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                            <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                          </View>
                        </TouchableHighlight>
                        <Text style={{width:'55%', fontSize:12, top:10}}>
                          {editedData.image3.fileName ? `  ${editedData.image3.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
              )}
              </View>
              {isEditing && (
                <View style={{ flexDirection: 'column', alignItems: 'center', top:40, marginBottom:100}}>
                <TouchableHighlight 
                  activeOpacity={0.8} 
                  underlayColor='#7698F3'
                  onPress={() => handleSave()}
                  style={{backgroundColor:'#3792CE', height:50, width:'90%', borderRadius:25, marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                  <View style={{flexDirection:'row'}}>
                    <Icon name="save" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                    <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Metrre a jour</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight 
                  activeOpacity={0.8} 
                  underlayColor='#A5B1AFE5' 
                  onPress={() => handleCancel()}
                  style={{backgroundColor:'#5C5959', height:50, width:'90%', borderRadius:25, alignItems:'center', justifyContent:'center', marginBottom:20}}>
                  <View style={{flexDirection:'row'}}>
                    <Icon name="cancel" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                    <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Annuler</Text>
                  </View> 
                </TouchableHighlight>
              </View>
              )}
            </View>
          </View>
        </ScrollView>
         ) : (
          <View style={styles.loadingContainer}>          
             <ActivityIndicator size="large" color="#3792CE" />
            <Text style={{color:'black'}}>chargement...</Text>
          </View>
        )}
        <Modal transparent visible={loading} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
               <ActivityIndicator size="large" color="#3792CE" />
              <Text style={{textAlign:'center', color:'#000000', top:15, fontWeight:'bold', fontSize:14}}>
                Patientez...            
              </Text>           
              </View>
            </View>
        </Modal>
        <CustomModal
          isVisible={isModalVisible}
          onClose={closeModal}
          message={error}
        />
        <Alert
          isVisible={isVisible}
          onClose={closeModal2}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex:1,
    backgroundColor:'white',
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
    fontSize: 14,
    fontWeight: 'bold',
    color:'black',
    left:5,
  },

  input:{
    height: 40,
    width : '100%',
    borderBottomWidth: 0.5,
    borderColor:'gray',
    margin:10,
    color:'black',
    fontSize: 16,
  },
  input1:{
    width : '100%',
    borderBottomWidth: 0.5,
    borderColor:'gray',
    margin:10,
  },
  
  input2:{
    width : '100%',
    borderBottomWidth: 1,
    borderColor:'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
})



export default UserCompte;
