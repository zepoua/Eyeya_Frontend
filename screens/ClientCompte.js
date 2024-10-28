import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, StyleSheet, ScrollView, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ClientCompte = () => {
    const navigation = useNavigation();

  const [clientData, setClientData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState('');
  const [isVisible, setVisible] = useState(false);

  const getData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formDataToSend');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        setClientData(parsedData);
        setEditedData(parsedData);
        setImage(parsedData.icone.fileName)
        setDataLoaded(true)
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError('')
    setIsEditing(false);
    setEditedData(clientData);
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
            const { uri, fileName, type } = response.assets[0];
            const updatedData = { ...editedData, icone: {uri, fileName, type} };
            setEditedData(updatedData);
            setImage(editedData.icone.fileName)
        }
      });
    };

  const handleSave = () => {
    setLoading(true);
  
    const formData = new FormData();
    formData.append('id', editedData.id);
    formData.append('nom', editedData.nom);
    formData.append('prenom', editedData.prenom);
    formData.append('email', editedData.email);
    formData.append('telephone', editedData.telephone);
  
    // Assurez-vous que l'icone existe et contient les propriétés nécessaires
      formData.append('icone', {
        uri: editedData.icone.uri,
        type: editedData.icone.type,
        name: editedData.icone.fileName,
      });
    
      
    const apiUrl = `${apiConfig.apiUrl}/update_client`;
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
          setModalVisible(true);
        }
      })
      .catch((error) => {
        setError('Verifiez votre connexion')
        setModalVisible(true)
      })
      .finally(() => setLoading(false));
  };

  const user = () =>{
    navigation.navigate('Client_User', {clientData})
  };

  const updateStoredData = async (data) => {
    try {
      await AsyncStorage.setItem('formDataToSend', JSON.stringify(data));
    } catch (error) {
    }
  };

  const handleChangeText = (key, value) => {
    setEditedData(prevData => ({ ...prevData, [key]: value }));
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const logOut =  () => {
    AsyncStorage.removeItem('formDataToSend');
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginClient' }],
    });  }

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
          <View>
            <View style={{ flexDirection: 'row', justifyContent:'flex-start', width:'100%'}}>
              {editedData.icone && (
                <Image
                  source={{ uri: `${apiConfig.imageUrl}/${image}` }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderColor: '#053D37E5',
                    borderWidth: 1,
                  }}
                />
              )}
              <Text style={{textAlign:'center', alignSelf:'center', left:10,fontSize: 16, fontWeight: 'bold', color:'black', maxWidth:'70%',}}>{editedData.nom} {editedData.prenom}</Text>
            </View>
            {!isEditing && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', top:30,}}>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#A5B1AFE5' 
                    onPress={() => handleEdit()}
                    style={{backgroundColor:'#5C5959', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                    <Text style={{ color:'white', fontSize:12}}>Modifier mon Profil</Text>
                  </TouchableHighlight>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#7698F3'
                    onPress={() => user()}
                    style={{backgroundColor:'#3792CE', height:40, width:'48%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                    <Text style={{ color:'white', fontSize:12}}>Compte Professionnel </Text>
                  </TouchableHighlight>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:40, marginBottom:20,}}>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#272727'
                    onPress={() => {setVisible(true)}}
                    style={{backgroundColor:'#000000', height:40, width:'80%', borderRadius:50, justifyContent:'center', alignItems:'center', margin:3}}>
                    <Text style={{ color:'white', fontSize:12}}>Deconnexion</Text>
                  </TouchableHighlight>
                </View>
              </View>
            )}

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
                value={String(editedData.telephone)} editable={isEditing}/>

              <Text style={styles.libelle}>email</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangeText('email', text)}
                value={editedData.email} editable={isEditing}/>

            {isEditing && (
              <View style={styles.input1}>
                <Text style={styles.libelle}>
                  Modifier votre photo
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
                  <Text style={{width:'50%', fontSize:12, top:10}}>
                    {editedData.icone.fileName ? `  ${editedData.icone.fileName.substring(0, 20)}...` : ''}
                  </Text>
                </View>
              </View>
            )}

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
    padding:10
  },
  libelle: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'black',
    left:5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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



export default ClientCompte;
