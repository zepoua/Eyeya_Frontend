import { View, Text, ScrollView, TouchableHighlight, TextInput, StyleSheet, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import apiConfig from '../services/config';
import Geolocation from '@react-native-community/geolocation';
import CustomModal from './test';


const CreateUser = ({navigation}) => {

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nom_entreprise:'',
    email: '',
    password: '',
    adresse: '',
    telephone1: '',
    telephone2: '',
    qualification: '',
    experience: '',
    description: '',});
  const [currentLocation, setCurrentLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [domaines, setDomaines] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState('');
  
    // Effectuez une requête fetch pour obtenir les données des domaines
  useEffect(() => {
      // Remplacez cette URL par l'URL de votre API qui fournit les données des domaines
    const apiUrl = `${apiConfig.apiUrl}/liste_domaines`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setDomaines(data);
    })
    .catch((error) => {
    });
  }, []);

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
      setCurrentLocation({ latitude, longitude });
      setError('Position recuperee avec succes...')
      setModalVisible(true)
    } catch (error) {
      setError('Position non recuperee, verifiez votre connexion et reessayer.')
      setModalVisible(true)
    } finally {
      setLoading(false);
    }
  };
      
  
  const handleFieldChange = (fieldName, text) => {
    if (fieldName === 'nom') {
      text = text.toUpperCase();
    }else if(fieldName === 'nom_entreprise'){
      text = text.toUpperCase();
    }

    setFormData({
      ...formData,
      [fieldName]: text,
    });
  };

  const [Images1, setImages1] = useState({});
  const [Images2, setImages2] = useState({});
  const [Images3, setImages3] = useState({});      


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
              switch (index) {
                case 0:
                    setImages1(response.assets[0]);
                    break;
                case 1:
                    setImages2(response.assets[0]);
                    break;
                case 2:
                    setImages3(response.assets[0]);
                    break;
                default:
                    break;
            }
        }
      });
  };

  const handleSubmit = () => {
    setLoading(true);

    const formDataToSend = {
      nom_entreprise: formData.nom_entreprise,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      adresse: formData.adresse,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      telephone1: formData.telephone1,
      telephone2: formData.telephone2,
      qualification: formData.qualification,
      experience: formData.experience,
      description: formData.description,
      domaine_id: selectedDomaine,
      image1: {
        uri: Images1.uri,
        name: Images1.fileName,
        type: Images1.type
      },
      image2: {
        uri: Images2.uri,
        name: Images2.fileName,
        type: Images2.type
      },
      image3: {
        uri: Images3.uri,
        name: Images3.fileName,
        type: Images3.type
      },
    };

    const userData = new FormData();
    userData.append('nom', formData.nom);
    userData.append('nom_entreprise', formData.nom_entreprise);
    userData.append('prenom', formData.prenom);
    userData.append('email', formData.email);
    userData.append('password', formData.password);
    userData.append('adresse', formData.adresse);
    userData.append('latitude', currentLocation.latitude);
    userData.append('longitude', currentLocation.longitude);
    userData.append('telephone1', formData.telephone);
    userData.append('telephone2', formData.telephone2);
    userData.append('qualification', formData.qualification);
    userData.append('experience', formData.experience);
    userData.append('description', formData.description);
    userData.append('domaine_id', selectedDomaine);
    if (Images1 && Images1.uri) {
      userData.append('image1', {
        uri: Images1.uri,
        type: Images1.type,
        name: Images1.fileName,
      });
    }
    if (Images2 && Images2.uri) {
      userData.append('image1', {
        uri: Images2.uri,
        type: Images2.type,
        name: Images2.fileName,
      });
    }
    if (Images3 && Images3.uri) {
      userData.append('image1', {
        uri: Images3.uri,
        type: Images3.type,
        name: Images3.fileName,
      });
    }

    const apiUrl = `${apiConfig.apiUrl}/code_user`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: userData,
    };

    // Effectuez la requête fetch vers votre API
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
          if (data.status == 'success'){
            navigation.navigate('ConfirmationUser', {formDataToSend})     
          }else{
            setError(data.message);
            setModalVisible(true);      
          }
      })
      .catch((error) => {
        setError('Verifiez votre connexion')
        setModalVisible(true)
      }).finally(() => setLoading(false));
    };

    const handleReset = () => {
        setFormData ({
            nom: '',
            prenom: '',
            nom_entreprise:'',
            email: '',
            password: '',
            adresse: '',
            position: '',
            telephone1: '',
            telephone2: '',
            qualification: '',
            experience: '',
            description: '',
        });
            setSelectedDomaine('') 
            setImages1({})
            setImages2({})      
            setImages3({})
            setCurrentLocation('') 
            setError('')
            navigation.goBack()
    }

    const closeModal = () => {
      setModalVisible(false);
    };  

    return (
        <View style={styles.Container}>
          <View style={styles.Container1}>
            <ScrollView style={{paddingLeft:15, paddingRight:15,}}> 
              <View style={{flexDirection:'colunn', marginBottom: 5, justifyContent:'center', alignItems:'center',}}>
                <Icon name="supervisor-account" size={70} color="black" style={{marginRight:0,}}/>
                <Text style={styles.titre}>Compte Professionnel</Text >
              </View>    
                <Text style={styles.titre2}>
                  Créer votre compte Professionnel et soyez contactez par des clients à la recherche de prestataires de services.
                </Text >
                <Text style={styles.libelle}>
                    Nom
                </Text >
                <TextInput 
                    placeholder='Entrez votre nom' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(text) => handleFieldChange('nom', text)}/>

                <Text style={styles.libelle}>
                    Prenom
                </Text>
                <TextInput 
                    placeholder='Entrez votre Prenom' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(text) => handleFieldChange('prenom', text)}/>                
                    
                <Text style={styles.libelle}>
                    Nom de l'entreprise
                </Text>
                <TextInput 
                    placeholder='Entrez Le nom de votre entreprise' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.nom_entreprise}
                    onChangeText={(text) => handleFieldChange('nom_entreprise', text)}/>

                <Text style={styles.libelle}>
                    Adresse Mail
                </Text>
                <TextInput 
                    placeholder='Votre Adresse mail' 
                    inputMode='email' 
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleFieldChange('email', text)}/>

                <Text style={styles.libelle}>
                    Mot de passe
                </Text>
                <TextInput 
                    placeholder='Entrez un mot de passe' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => handleFieldChange('password', text)}/>

                <Text style={styles.libelle}>
                    Adresse
                </Text>
                <TextInput 
                    placeholder='Entrez votre adresse' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.adresse}
                    onChangeText={(text) => handleFieldChange('adresse', text)}/>

                <View style={styles.input1}>
                  <Text style={styles.libelle}>
                      Geolocalisation
                  </Text>
                  <TouchableHighlight 
                    onPress={position}
                    style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                      <View style={{flexDirection:'row'}}>
                        <MaterialCommunityIcons name="google-maps" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                        <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                      </View>
                  </TouchableHighlight>
                </View>
                <Text style={styles.libelle}>
                    Telephone 1
                </Text>
                <TextInput 
                    placeholder='Numero de telephone' 
                    inputMode='tel' 
                    style={styles.input}
                    value={formData.telephone1}
                    onChangeText={(text) => handleFieldChange('telephone1', text)}/>

                <Text style={styles.libelle}>
                    Telephone 2
                </Text>
                <TextInput 
                    placeholder='autre numero de telephone' 
                    inputMode='tel' 
                    style={styles.input}
                    value={formData.telephone2}
                    onChangeText={(text) => handleFieldChange('telephone2', text)}/>    
    
                <Text style={styles.libelle}>
                    Qualifications
                </Text>
                <TextInput 
                    placeholder='vos qualifications' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.qualification}
                    onChangeText={(text) => handleFieldChange('qualification', text)}/>

                <Text style={styles.libelle}>
                    Experiences
                </Text>
                <TextInput 
                    placeholder='vos experiences' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.experience}
                    onChangeText={(text) => handleFieldChange('experience', text)}/>
                
                <Text style={styles.libelle}>
                    Description
                </Text>
                <TextInput 
                    placeholder='description de votre entreprise' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.description}
                    onChangeText={(text) => handleFieldChange('description', text)}/>   

                <View style={styles.input1}>
                  <Text style={styles.libelle}>
                      Sélectionnez un domaine
                  </Text>
                      <Picker
                          style={styles.input2}
                          selectedValue={selectedDomaine}
                          onValueChange={(itemValue, itemIndex) => setSelectedDomaine(itemValue)}>
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
                    </View>
                    <View style={styles.input1}>
                      <Text style={styles.libelle}>
                          Photo de Profil
                      </Text>
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
                          {Images1.fileName ? `  ${Images1.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.input1}>
                      <Text style={styles.libelle}>
                          Photo de Couverture
                      </Text>
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
                          {Images2.fileName ? `  ${Images2.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.input1}>
                      <Text style={styles.libelle}>
                         Autre Photo (optionnel)
                      </Text>
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
                          {Images3.fileName ? `  ${Images3.fileName.substring(0, 20)}...` : ''}
                        </Text>
                      </View>
                    </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', top:30, marginBottom:100, }}>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#7698F3'
                    onPress={() => handleSubmit()}
                    style={{backgroundColor:'#3792CE', height:50, width:'90%', borderRadius:25, marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                      <Icon name="save" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                      <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Enregistrer</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    activeOpacity={0.8} 
                    underlayColor='#A5B1AFE5' 
                    onPress={() => handleReset()}
                    style={{backgroundColor:'#5C5959', height:50, width:'90%', borderRadius:25, alignItems:'center', justifyContent:'center', marginBottom:20}}>
                    <View style={{flexDirection:'row'}}>
                      <Icon name="cancel" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                      <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Annuler</Text>
                    </View> 
                  </TouchableHighlight>
                </View>
            </ScrollView>
          </View>
            
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
        </View>
    
      );
}

const styles = StyleSheet.create({
    Container: {
      flex:1,
      backgroundColor:'#3792CE'
    },
    Container1: {
      height:'100%', 
      backgroundColor:'white', 
      borderTopLeftRadius:30, 
      borderTopRightRadius:30,
      marginTop:10,
    },
    
    libelle: {
      fontSize: 14,
      fontWeight: 'bold',
      color:'black',
      marginTop: 9,
      marginBottom: 6,
    },
    titre: {
      fontSize: 28,
      fontWeight: 'bold',
      color:'#3792CE',
      textAlign: 'center',
    },
    input:{
      height: 35,
      width : '100%',
      borderBottomWidth:1,
      color:'black',
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 20,
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
      input1:{
        width : '100%',
        borderBottomWidth: 1,
        borderColor:'gray',
        margin:0,
      },
      input2:{
        width : '80%',
        borderBottomWidth: 1,
        borderColor:'gray',
      },
      titre2: {
        fontSize: 16,
        color:'black',
        textAlign: 'center',
        marginBottom: 15,
      },
  });

export default CreateUser