import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableHighlight } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Alert } from 'react-native-windows';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';

const ConfirmationUser = ({route, navigation}) => {

    const [code, setCode] = useState();

    const { formDataToSend } = route.params;
  
    const handleFieldChange = (text) => { setCode(text) };  

    const handleSubmit = () => {

        const userData = {
            code,
            ...formDataToSend
        }
        const apiUrl = `${apiConfig.apiUrl}/user`;
        const requestOptions = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        };
    
      // Effectuez la requête fetch vers votre API
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
            if (data.status == 'success') {
                const id = data.client_id;
                const user_id = data.user_id;
                const dataToStoreLocally ={
                id,
                user_id,
                ...formDataToSend, }

                Alert.alert(data.message);
                try{
                AsyncStorage.setItem('formDataToSend', JSON.stringify(dataToStoreLocally))
                    .then(() => {
                        console.log('Données stockées localement');
                    });
                    navigation.navigate('Home');
                }catch(error){
                    console.error('Erreur lors du stockage local :', error);
                }  
                setCode('');
            } else {
                Alert.alert(data.message);
            }
            }).catch((error) => {
            console.error('Erreur :', error.message);
            });
    };

    const handleReset = () => {setCode('') };

    return (
        <View style={styles.Container}>
            <ScrollView>
                <Text style={styles.titre}>Confirmation D'inscription</Text >
                    <Text style={styles.libelle}>
                        Numero de telephone
                    </Text>
                    <TextInput 
                        placeholder='numero de telephone' 
                        inputMode='tel' 
                        style={styles.input}
                        value={formDataToSend.telephone1}
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
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top:30, marginBottom:50}}>
                <TouchableHighlight 
                  onPress={handleSubmit}
                  style={{backgroundColor:'#37CE37', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Enregistrer</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                  onPress={handleReset}
                  style={{backgroundColor:'#810A0A', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Annuler</Text>
                </TouchableHighlight>
              </View>
        </ScrollView>
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
          fontSize: 28,
          fontFamily: 'algerian',
          fontWeight: 'bold',
          color:'darkblue',
          textAlign: 'center',
          paddingTop: 15,
          paddingBottom: 25,
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
    
    export default ConfirmationUser