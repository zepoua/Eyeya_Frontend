import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableHighlight } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Alert } from 'react-native-windows';
import * as ImagePicker from 'react-native-image-picker';
import apiConfig from '../services/config';


const CreateClient = ({navigation}) => {

  const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    });

    const [Image, setImage] = useState('');

    const handleFieldChange = (fieldName, text) => {
      setFormData({
        ...formData,
        [fieldName]: text,
      });
    };

    const selectImage = () => {
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
                  console.log('Annulé');
              } else if (response.error) {
                  console.error('Erreur :', response.error);
              } else {
                  setImage(response.assets[0].uri);
                  console.log(Image)
              }
          }
      );
  };

    const handleSubmit = () => {
      const formDataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        icone: Image,
      };

      const apiUrl = `${apiConfig.apiUrl}/code_client`;
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
          console.log(data.message);
          if (data.status == 'success') {
            navigation.navigate('ConfirmationClient', { formDataToSend });
            setFormData ({
              nom: '',
              prenom: '',
              email: '',
              telephone: '',
            })
          } else {
            Alert.alert(data.message);
        }
        }).catch((error) => {
          console.error('Erreur :', error.message);
        });
    };
    

  const handleReset = () => {
    setFormData ({
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    })
  }


  return (
    <View style={styles.Container}>

        <ScrollView>

            <Text style={styles.titre}>
              Inscription Client
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
                    Adresse Mail
                </Text>
                <TextInput 
                    placeholder='Votre Adresse mail' 
                    inputMode='email' 
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleFieldChange('email', text)}/>
                
                <Text style={styles.libelle}>
                    Votre numero de telephone
                </Text>
                <TextInput 
                    placeholder='numero de telephone' 
                    inputMode='tel' 
                    style={styles.input}
                    value={formData.tel}
                    onChangeText={(text) => handleFieldChange('telephone', text)}/>
                <Text style={styles.libelle}>
                    Photo de Profil
                </Text>
                <TouchableHighlight 
                onPress={() => selectImage()}
                style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', top:15, marginBottom:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
              </TouchableHighlight>
            
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top:30, marginBottom:50}}>
                <TouchableHighlight 
                  onPress={() => handleSubmit()}
                  style={{backgroundColor:'#37CE37', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Enregistrer</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                  onPress={() => handleReset()}
                  style={{backgroundColor:'#810A0A', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Annuler</Text>
                </TouchableHighlight>
              </View>
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 50}}>
          <Text style={{textAlign:'center', fontWeight: 'bold'}}>
            Etes-vous un Professionnel ? 
          </Text>
          <TouchableHighlight 
            onPress={() => {navigation.navigate('CreateUser')}}
            activeOpacity={0.8} 
            underlayColor='#EFF7F6E5'>
              <Text style={{textAlign:'center', marginLeft: 6, fontWeight: 'bold', color:'#18055EE5'}}>
                Inscrivez-vous ici !
              </Text>
            </TouchableHighlight>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    Container: {
      margin: 20,
      flex:1
    },
    libelle: {
      fontSize: 20,
      fontFamily: 'Cochin',
      fontWeight: 'bold',
      color:'black',
    },
    titre: {
      fontSize: 40,
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
      borderBottomWidth: 1
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 20,
    },
  });

export default CreateClient