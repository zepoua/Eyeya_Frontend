import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableHighlight, Modal, ActivityIndicator, ScrollView} from 'react-native';
import apiConfig from '../services/config';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginClient = ({ navigation }) => {
  const [formData, setFormData] = useState({
    telephone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleFieldChange = (fieldName, text) => {
    setFormData({
      ...formData,
      [fieldName]: text,
    });
  };

  const handleSubmit = async () => {
    try {
      // Activer l'indicateur de chargement
      setLoading(true);

      const formDataToSend = {
        telephone: formData.telephone,
      };

      const apiUrl = `${apiConfig.apiUrl}/login_code`;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      };

      // Effectuez la requête fetch vers votre API
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (data.status === 'success') {
        navigation.navigate('LoginCode', {data: formDataToSend})
      } else {
        setError(data.message);
        setModalVisible(true);      }
    } catch (error) {
      setError('Verifiez votre connexion')
      setModalVisible(true)
      // Gérer les erreurs ici, par exemple, définir un état d'erreur pour l'interface utilisateur
    } finally {
      // Désactiver l'indicateur de chargement
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      telephone: '',
    });
    setError('')
    navigation.goBack();
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  return (
    <View style={styles.Container}>
        <View style={styles.Container1}>
          <View style={{flexDirection:'colunn', marginBottom: 5, justifyContent:'center', alignItems:'center'}}>
            <Icon name="login" size={70} color="black" style={{marginRight:10,}}/>
            <Text style={styles.titre}>Connectez-vous !</Text >
          </View>
              <Text style={styles.titre2}>
                Entrez le numero de telephone utilise lors de votre creation de compte. Un code de connexion vous sera envoye.
              </Text >

              <Text style={styles.libelle}>
                  Numero de Telephone
              </Text>
              <TextInput 
                  placeholder='Votre numero de telephone' 
                  inputMode='tel' 
                  style={styles.input}
                  value={formData.telephone}
                  onChangeText={(text) => handleFieldChange('telephone', text)}/>
            
                <View style={{ flexDirection: 'column', alignItems: 'center', top:30, marginBottom:100, }}>
                  <TouchableHighlight 
                    activeOpacity={0.8} 
                    underlayColor='#7698F3'
                    onPress={() => handleSubmit()}
                    style={{backgroundColor:'#3792CE', height:50, width:'90%', borderRadius:25, marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                      <Icon name="login" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                      <Text style={{ color:'white', fontSize:16, textAlign:'center'}}>Recevoir le code</Text>
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
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#3792CE',
  },
 
  Container1: {
    height:'100%',  
    backgroundColor:'white', 
    borderTopLeftRadius:30, 
    borderTopRightRadius:30,
    marginTop:10,
    paddingLeft:20,
    paddingRight:20,
    justifyContent:'center',
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
    marginBottom: 15,
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

export default LoginClient;
