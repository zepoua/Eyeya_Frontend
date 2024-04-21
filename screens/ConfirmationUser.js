import { View, Text, Modal, ActivityIndicator, TextInput, StyleSheet, Button, TouchableHighlight } from 'react-native'
import React from 'react'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConfirmationUser = ({route, navigation}) => {

    const [code, setCode] = useState();
    const { formDataToSend } = route.params;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleFieldChange = (text) => { setCode(text) };  

    const handleSubmit = () => {
      setLoading(true)
      const formData = new FormData();
      formData.append('code', code);
      formData.append('nom_entreprise', formDataToSend.nom_entreprise);
      formData.append('nom', formDataToSend.nom);
      formData.append('prenom', formDataToSend.prenom);
      formData.append('email', formDataToSend.email);
      formData.append('password', formDataToSend.password);
      formData.append('adresse', formDataToSend.adresse);
      formData.append('latitude', formDataToSend.latitude);
      formData.append('longitude', formDataToSend.longitude);
      formData.append('telephone1', formDataToSend.telephone1);
      formData.append('telephone2', formDataToSend.telephone2);
      formData.append('qualification', formDataToSend.qualification);
      formData.append('experience', formDataToSend.experience);
      formData.append('description', formDataToSend.description);
      formData.append('domaine_id', formDataToSend.domaine_id);
      formData.append('image1', {
        uri: formDataToSend.image1.uri,
        type: formDataToSend.image1.type,
        name: formDataToSend.image1.fileName,
      });
      formData.append('image2', {
        uri: formDataToSend.image2.uri,
        type: formDataToSend.image2.type,
        name: formDataToSend.image2.fileName,
      });
      formData.append('image3', {
        uri: formDataToSend.image3.uri,
        type: formDataToSend.image3.type,
        name: formDataToSend.image3.fileName,
      });
  
    const apiUrl = `${apiConfig.apiUrl}/user`;
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
            const id = data.client_id;
            const user_id = data.user_id;
            const dataToStoreLocally ={
            id,
            user_id,
            ...formDataToSend,}
            AsyncStorage.setItem('formDataToSend', JSON.stringify(dataToStoreLocally))
                .then(() => {
                  setError(data.message);
                  setModalVisible(true);
                  setTimeout(() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    });
                  }, 2000); 
                });  
            setCode('');
        } else {
          setError(data.message);
          setModalVisible(true);            }
        }).catch((error) => {
          setError('Verifiez votre connexion')
          setModalVisible(true)
        }).finally(()=>setLoading(false))
    };

    const handleReset = () => {setCode('');  setError(''); navigation.goBack();  };
    const closeModal = () => {
      setModalVisible(false);
    };  

    return (
      <View style={styles.Container}>
          <View style={styles.Container1}>
            <View style={{flexDirection:'colunn', marginBottom: 5, justifyContent:'center', alignItems:'center'}}>
              <Icon name="supervisor-account" size={70} color="black" style={{marginRight:10,}}/>
              <Text style={styles.titre}>Confirmation D'inscription</Text >
            </View>              <Text style={styles.titre2}>
                Entrez le code de confirmation d'inscription envoye sur ce numero.
              </Text >
                  <Text style={styles.libelle}>
                      Numero de telephone
                  </Text>
                  <TextInput 
                      inputMode='tel' 
                      value={formDataToSend.telephone}
                      style={styles.input}
                      editable={false}/>
                   <Text style={styles.libelle}>
                      Code de confirmation
                  </Text>
                  <TextInput 
                      placeholder='Code de confirmation' 
                      inputMode='tel' 
                      style={styles.input}
                      value={code}
                      onChangeText={handleFieldChange}/>
                 
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
                  style={{backgroundColor:'#5C5959', height:50, width:'90%', borderRadius:25, alignItems:'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                      <Icon name="cancel" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                      <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Annuler</Text>
                    </View> 
                </TouchableHighlight>
            </View>
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
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center',
  },

    libelle: {
      fontSize: 16,
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
      marginBottom: 20,
    },
    titre2: {
      fontSize: 16,
      color:'black',
      textAlign: 'center',
      marginBottom: 25,
    },
    input:{
      height: 35,
      width : '100%',
      borderBottomWidth: 1,
      color:'black'
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
});
  
  export default ConfirmationUser;