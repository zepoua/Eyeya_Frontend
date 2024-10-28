import { View, Text, ScrollView, TextInput, StyleSheet, Modal, TouchableHighlight, ActivityIndicator, BackHandler, Image } from 'react-native'
import React from 'react'
import { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import apiConfig from '../services/config';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateClient = ({navigation}) => {

  const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    });

    const [image, setImage] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleFieldChange = (fieldName, text) => {
      if (fieldName === 'nom') {
        setFormData({
          ...formData,
          ['nom']: text.toUpperCase(),
        });      
      }else{
        setFormData({
          ...formData,
          [fieldName]: text,
        });
      }
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
            } else if (response.error) {
            } else {
              setImage(response.assets[0]);
          }
        });
    };

  const handleSubmit = () => {
    setLoading(true);
    
    const clientData = new FormData();
    clientData.append('nom', formData.nom);
    clientData.append('prenom', formData.prenom);
    clientData.append('email', formData.email);
    clientData.append('telephone', formData.telephone);
    if (image.uri) {
      clientData.append('icone', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    }
    
    const formDataToSend = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      icone: {
        uri: image.uri,
        fileName: image.fileName,
        type:image.type
      }
    };

    const apiUrl = `${apiConfig.apiUrl}/code_client`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: clientData,
    };
    
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'success') {
          // const id = data.client_id;
          // const dataToStoreLocally ={
          // id,
          // ...formDataToSend, }
          //   AsyncStorage.setItem('formDataToSend', JSON.stringify(dataToStoreLocally))
          //   .then(() => {
          //     setError(data.message);
          //     setModalVisible(true);
          //     setTimeout(() => {
          //       navigation.reset({
          //         index: 0,
          //         routes: [{ name: 'Home' }],
          //       });
          //     }, 2000); 
          //   }); 
          // setCode('');
          navigation.navigate('ConfirmationClient', {formDataToSend})     
      } else {
          setError(data.message);
          setModalVisible(true);
        }
      }).catch((error) => {
        console.log(error)
        setError('Verifiez votre connexion')
        setModalVisible(true)
      }).finally(() => setLoading(false));
  };
    
  const handleReset = () => {
    setFormData ({
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    })
    setError('')
    setImage({})
    BackHandler.exitApp();
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.Container}>
        <View style={styles.Container1}>
          <ScrollView style={{paddingLeft:15, paddingRight:15,}}>
            <View style={{flexDirection:'colunn', marginBottom: 5, justifyContent:'center', alignItems:'center'}}>
              <Icon name="supervisor-account" size={70} color="black" style={{marginRight:10,}}/>
              <Text style={styles.titre}>Compte Client</Text >
            </View>            
            <Text style={styles.titre2}>
              Créer votre compte client. Rechercher des Professionnels et échangez eux pour vos travaux selon vos besoins et vos critères.
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

                <View style={styles.input1}>
                  <Text style={styles.libelle}>
                      Photo de Profil
                  </Text>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                    <TouchableHighlight 
                      onPress={() => selectImage()}
                      style={{backgroundColor:'#3792CE',height:35, width:'40%', borderRadius:50, justifyContent:'center', alignItems:'center', top:5, marginBottom:15}}>
                      <View style={{flexDirection:'row'}}>
                        <Icon name="add-a-photo" size={20} color="#FFFFFFE5" style={{marginRight:10,}}/>
                        <Text style={{ color:'white', fontSize:14, textAlign:'center'}}>Cliquez-ici</Text>
                      </View>
                    </TouchableHighlight>
                    <Text style={{width:'55%', fontSize:12, top:10}}>
                      {image.fileName ? `  ${image.fileName.substring(0, 20)}...` : ''}
                    </Text>
                  </View> 
               </View>
                <View style={{marginTop:10, alignItems:'center'}}>
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
               

                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom:5}}>
                  <Text style={{textAlign:'center', fontWeight: 'bold'}}>
                    Etes-vous un Professionnel ? 
                  </Text>
                  <TouchableHighlight 
                    onPress={() => {navigation.navigate('CreateUser')}}
                    activeOpacity={0.8} 
                    underlayColor='#EFF7F6E5'>
                      <Text style={{textAlign:'center', marginLeft: 6, fontWeight: 'bold', color:'#3792CE'}}>
                        Inscrivez-vous ici !
                      </Text>
                    </TouchableHighlight>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom:10}}>
                  <Text style={{textAlign:'center', fontWeight: 'bold'}}>
                    Avez-vous un compte ?  
                  </Text>
                  <TouchableHighlight 
                    onPress={() => {navigation.navigate('LoginType')}}
                    activeOpacity={0.8} 
                    underlayColor='#EFF7F6E5'>
                      <Text style={{textAlign:'center', marginLeft: 6, fontWeight: 'bold', color:'#3792CE'}}>
                        Connectez-vous ici !
                      </Text>
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
  )
};

const styles = StyleSheet.create({
    Container: {
      flex:1,
      backgroundColor:'#3792CE',
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
      fontFamily: 'Cochin',
      fontWeight: 'bold',
      color:'black',
    },

    titre: {
      fontSize: 28,
      fontFamily: 'algerian',
      fontWeight: 'bold',
      color:'#3792CE',
      textAlign: 'center',
    },

    titre2: {
      fontSize: 16,
      color:'black',
      textAlign: 'center',
      marginBottom: 15,
    },
    input:{
      height: 35,
      width : '100%',
      borderBottomWidth: 1,
      color:'black',
      marginBottom:5
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
      borderBottomWidth: 0.5,
      borderColor:'gray',
      margin:10,
    },
  });

export default CreateClient