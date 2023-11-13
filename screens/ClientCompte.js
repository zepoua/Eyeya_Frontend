import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import { Alert } from 'react-native-windows';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const ClientCompte = () => {
    const navigation = useNavigation();

  const [clientData, setClientData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const getData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formDataToSend');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        setClientData(parsedData);
        setEditedData(parsedData); // Set editedData with the initial data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = async () => {
    AsyncStorage.clear();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(clientData);
  };

  const handleChoosePhoto = () => {
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
              const updatedData = { ...editedData, icone: response.assets[0].uri };
              setEditedData(updatedData);
                console.log(editedData.icone)
            }
        }
    );
};

  const handleSave = () => {
    const formDataToSend = {
      nom: editedData.nom,
      prenom: editedData.prenom,
      email: editedData.email,
      telephone: editedData.telephone,
      icone: editedData.icone,
    };

    const apiUrl = `${apiConfig.apiUrl}/client/${editedData.id}`;
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

  const user = () =>{
    navigation.navigate('Client_User', {clientData})
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
          <View style={{margin:10}}>
            <View style={{ flexDirection: 'row', justifyContent:'flex-start' }}>
              {editedData.icone && (
                <Image
                  source={{ uri: editedData.icone }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderColor: '#053D37E5',
                    borderWidth: 1,
                  }}
                />
              )}
              <Text style={{textAlign:'center', alignSelf:'center', left:20,fontSize: 20, fontFamily: 'Cochin', fontWeight: 'bold', color:'black', }}>{editedData.nom} {editedData.prenom}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', top:20, marginBottom:20,}}>
                {!isEditing && (
                <TouchableHighlight 
                onPress={() => handleEdit()}
                style={{backgroundColor:'#3792CE', height:40, width:'47%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Modifier mon Profil</Text>
                </TouchableHighlight>
              )}
              <TouchableHighlight 
                  onPress={() => user()}
                  style={{backgroundColor:'#37CE37', height:40, width:'51%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Compte Professionnel </Text>
                </TouchableHighlight>
            </View>
            <View style={{top:20}}>
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

              <Text style={styles.libelle}>Téléphone</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangeText('telephone', text)}
                value={editedData.telephone} editable={isEditing}/>

              <Text style={styles.libelle}>email</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangeText('email', text)}
                value={editedData.email} editable={isEditing}/>

              {isEditing && (
                <View>
                <Text style={styles.libelle}> Modifier votre photo</Text>
              <TouchableHighlight 
                  onPress={() => handleChoosePhoto()}
                  style={{backgroundColor:'#6C37CE', height:35, width:'40%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:20}}>
                <Text style={{ color:'white', fontSize:18}}>Cliquez-ici</Text>
            </TouchableHighlight></View>
            )}
            {isEditing && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top:30, marginBottom:50}}>
                <TouchableHighlight 
                  onPress={() => handleSave()}
                  style={{backgroundColor:'#37CE37', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
                  <Text style={{ color:'white', fontSize:18}}>Enregistrer</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                  onPress={() => handleCancel()}
                  style={{backgroundColor:'#810A0A', height:40, width:'48%', borderRadius:15, justifyContent:'center', alignItems:'center', margin:3}}>
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



export default ClientCompte;
