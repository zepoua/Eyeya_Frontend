import { View, Text, ScrollView, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native-windows';
import * as ImagePicker from 'react-native-image-picker';
import apiConfig from '../services/config';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Client_User = ({route, navigation}) => {

    const clientData = route.params.clientData;
    const [Images1, setImages1] = useState('');
    const [Images2, setImages2] = useState('');
    const [Images3, setImages3] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [formData, setFormData] = useState({
        nom_entreprise:'',
        password: '',
        adresse: '',
        telephone2: '',
        qualification: '',
        experience: '',
        description: '',});

    const [domaines, setDomaines] = useState([]);
      // État pour stocker la valeur sélectionnée dans la liste déroulante
    const [selectedDomaine, setSelectedDomaine] = useState('');
    
      // Effectuez une requête fetch pour obtenir les données des domaines
    useEffect(() => {
        // Remplacez cette URL par l'URL de votre API qui fournit les données des domaines
        const apiUrl = `${apiConfig.apiUrl}/domaine`;
    
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            setDomaines(data);
        })
        .catch((error) => {
            console.error('Erreur lors de la requête1 :', error);
        });
    }, []);
    
    const handleFieldChange = (fieldName, text) => {
        setFormData({
          ...formData,
          [fieldName]: text,
        });
    };      

    const selectImage = (index) => {
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
                            setImages1(response.assets[0].uri);
                            break;
                        case 1:
                            setImages2(response.assets[0].uri);
                            break;
                        case 2:
                            setImages3(response.assets[0].uri);
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
          setCurrentLocation({ latitude, longitude });
          console.log('currentLocation mis à jour:', currentLocation);
        } catch (error) {
          console.log('Erreur:', error.message);
          // Gérer l'erreur, par exemple afficher un message à l'utilisateur
        }
    };

    const handleSubmit = () => {
        const formDataToSend = {
            nom_entreprise: formData.nom_entreprise,
            nom: clientData.nom,
            prenom: clientData.prenom,
            email: clientData.email,
            password: formData.password,
            adresse: formData.adresse,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            telephone1: clientData.telephone,
            telephone2: formData.telephone2,
            qualification: formData.qualification,
            experience: formData.experience,
            description: formData.description,
            image1: Images1,
            image2: Images2,
            image3: Images3,
            domaine_id: selectedDomaine,
          };
          const apiUrl = `${apiConfig.apiUrl}/client_user`;
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
                if (data.status == 'success'){
                    const id = clientData.id;
                    const dataToStoreLocally ={
                        id,
                        ...formDataToSend, };

                    Alert.alert(data.message);
                    try {
                            AsyncStorage.removeItem('formDataToSend');
                            console.log('Données supprimées avec succès.');
                            try{
                                AsyncStorage.setItem('formDataToSend', JSON.stringify(dataToStoreLocally))
                                    .then(() => {
                                        console.log('Données stockées localement');
                                    });
                                    navigation.navigate('MonCompte');
                                }catch(error){
                                    console.error('Erreur lors du stockage local :', error);
                                }  
                            navigation.navigate('Home',{ screen: 'MonCompte' });
                      } catch (error) {
                        console.error('Erreur lors de la suppression des données :', error);
                      }
                  
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
                        setImages1('')
                        setImages2('')      
                        setImages3('')
                        setCurrentLocation(null)  
                }else{
                    Alert.alert(data.message);
                }
            })
            .catch((error) => {
              console.error('Erreur :', error);
            });
    };

    const handleReset = () => {
        setFormData ({
            nom_entreprise:'',
            password: '',
            adresse: '',
            telephone2: '',
            qualification: '',
            experience: '',
            description: '',
        });
            setSelectedDomaine('') 
            setImages1('')
            setImages2('')      
            setImages3('')
            setCurrentLocation(null)       
    }

    return (
        <View style={styles.Container}>

            <ScrollView>

                <Text style={styles.titre}>
                    Compte Professionnel
                </Text >

                <Text style={styles.libelle}>
                    Nom
                </Text >
                <TextInput 
                    placeholder='Entrez votre nom' 
                    inputMode='text' 
                    style={styles.input}
                    value={clientData.nom}
                    editable={false}/>

                <Text style={styles.libelle}>
                    Prenom
                </Text>
                <TextInput 
                    placeholder='Entrez votre Prenom' 
                    inputMode='text' 
                    style={styles.input}
                    value={clientData.prenom}
                    editable={false} />                
                    
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
                    value={clientData.email}
                    editable={false} />

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

                <Text style={styles.libelle}>
                    Geolocalisation
                </Text>
                <TouchableHighlight 
                onPress={position}
                style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', top:15, marginBottom:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
              </TouchableHighlight>

                <Text style={styles.libelle}>
                    Telephone 1
                </Text>
                <TextInput 
                    placeholder='Numero de telephone' 
                    inputMode='tel' 
                    style={styles.input}
                    value={clientData.telephone}
                    editable={false} />

                <Text style={styles.libelle}>
                    Telephone 2
                </Text>
                <TextInput 
                    placeholder='autre numero de telephone (optionnel)' 
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

                <Text style={styles.libelle}>
                    Sélectionnez un domaine
                </Text>
                    <Picker
                        style={styles.input}
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
                
                <Text style={styles.libelle}>
                    Photo de Profil
                </Text>
                <TouchableHighlight 
                onPress={() => selectImage(0)}               
                style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', top:15, marginBottom:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                </TouchableHighlight>

                <Text style={styles.libelle}>
                    Photo de Couverture
                </Text>
                <TouchableHighlight 
                onPress={() => selectImage(1)}
                style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', top:15, marginBottom:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                </TouchableHighlight>

                <Text style={styles.libelle}>
                    Autre Photo
                </Text>
                <TouchableHighlight 
                onPress={() => selectImage(2)}
                style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', top:15, marginBottom:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
                </TouchableHighlight>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top:30, marginBottom:50}}>
                <TouchableHighlight 
                  onPress={handleSubmit}
                  style={{backgroundColor:'#37CE37', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Enregistrer</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                  onPress={handleReset}
                  style={{backgroundColor:'#810A0A', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Annuler</Text>
                </TouchableHighlight>
              </View>
        </ScrollView>
        </View>
    
      );
}

const styles = StyleSheet.create({
    Container: {
      margin: 20
    },
    libelle: {
      fontSize: 20,
      fontFamily: 'Cochin',
      fontWeight: 'bold',
      color:'black',
      marginTop: 9,
      marginBottom: 6,
    },
    titre: {
      fontSize: 32,
      fontFamily: 'algerian',
      fontWeight: 'bold',
      color:'darkblue',
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 15,
    },
    input:{
      height: 35,
      width : 350,
      borderRadius: 6,
      borderBottomWidth:1,
      borderColor:'gray',
      color:'black',

      },
    
  });

export default Client_User