import { View, Text, ScrollView, TextInput, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Alert } from 'react-native-windows';
import AsyncStorage from '@react-native-async-storage/async-storage'


const CreateClient = ({navigation}) => {

  const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    });

    const handleFieldChange = (fieldName, text) => {
      setFormData({
        ...formData,
        [fieldName]: text,
      });
    };

    const handleSubmit = () => {
      const formDataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
      };
    
      const apiUrl = 'http://192.168.1.242:8000/api/client';
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
          if (data.status == 'success') {
            Alert.alert(data.message);
            try{
              AsyncStorage.setItem('formDataToSend', JSON.stringify(formDataToSend))
                  .then(() => {
                      console.log('Données stockées localement');
                  });
                  navigation.navigate('Home');
            }catch(error){
                console.error('Erreur lors du stockage local :', error);
            }  
            setFormData ({
              nom: '',
              prenom: '',
              email: '',
              telephone: ''
            })
          } else {
            Alert.alert(data);
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
            
            <View style={styles.button}>
              <Button title="Enregistrer" color= "green" onPress={handleSubmit}/>
              <Button title="Annuler" color= "red" onPress={handleReset}/>
            </View>
        </ScrollView>
    </View>
  )
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