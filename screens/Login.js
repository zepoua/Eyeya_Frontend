import { View, Text, Modal, TextInput, StyleSheet, TouchableHighlight, ActivityIndicator, BackHandler } from 'react-native'
import react, { useState } from 'react';
import apiConfig from '../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from './test';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = ({navigation}) => {


  const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    const [error, setError] = useState('');
    const [forget, setForget] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

  const handleFieldChange = (fieldName, text) => {
    setFormData({
      ...formData,
      [fieldName]: text,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    const formDataToSend = {
      email: formData.email,
      password: formData.password,
    };

    const apiUrl = `${apiConfig.apiUrl}/login`;
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
          const user_data = data.user_data;
          user_data.image1 = {
            uri: '',
            type: '',
            fileName: user_data.image1,
          };
          user_data.image2 = {
            uri: '',
            type: '',
            fileName: user_data.image2,
          };
          user_data.image3 = {
            uri: '',
            type: '',
            fileName: user_data.image3,
          };
          try{
            AsyncStorage.setItem('formDataToSend', JSON.stringify(user_data))
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
            }catch(error){
            }  
          setFormData ({
            password: '',
            email: '',
          })
        } else {
          setError(data.message);
          setModalVisible(true);
          setForget('Mot de Passe Oublie...')
      }
      }).catch((error) => {setError('Verifiez votre connexion')
      setModalVisible(true)})
      .finally(() => setLoading(false));
  };

  const handleReset = () =>{
    setFormData ({
      password: '',
      email: '',
    })
    setError('')
    BackHandler.exitApp();
  }

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
              Entrez l'adresse email et le mot de passe que vous avez defini lors de la creation de votre compte pour vous connectez et retrouvez vos données.
            </Text >
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
               Mot de Passe
            </Text>
            <TextInput 
                placeholder='mot de passe' 
                inputMode='text' 
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleFieldChange('password', text)}/>

              <View style={{ flexDirection: 'column', alignItems: 'center', top:30, marginBottom:100, }}>
                <TouchableHighlight 
                  activeOpacity={0.8} 
                  underlayColor='#7698F3'
                  onPress={() => handleSubmit()}
                  style={{backgroundColor:'#3792CE', height:50, width:'90%', borderRadius:25, marginBottom:10, alignItems:'center', justifyContent:'center'}}>
                  <View style={{flexDirection:'row'}}>
                    <Icon name="login" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                    <Text style={{ color:'white', fontSize:18, textAlign:'center'}}>Connexion</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={0.8} 
                  underlayColor='#A5B1AFE5' 
                  onPress={() => handleReset()}
                  style={{backgroundColor:'#5C5959', height:50, width:'90%', borderRadius:25, alignItems:'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                      <Icon name="cancel" size={30} color="#FFFFFFE5" style={{marginRight:10,}}/>
                      <Text style={{ color:'white', fontSize:18, textAlign:'center'}}>Annuler</Text>
                    </View> 
                </TouchableHighlight>
              </View>
              <TouchableHighlight
               activeOpacity={0.8} 
               underlayColor='#EFF7F6E5'
                onPress={() => navigation.navigate('LoginClient')}>
                <Text style={{textAlign:'left', color:'#1F0EBB', fontWeight:'bold', fontSize:16}}>
                  {`${forget}`}            
                </Text>
            </TouchableHighlight>
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
    backgroundColor:'#3792CE',
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
    fontSize: 20,
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color:'black',
  },
  titre: {
    fontSize: 35,
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
});

export default Login