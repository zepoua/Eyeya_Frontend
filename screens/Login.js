import { View, Text, ScrollView, TextInput, StyleSheet, Button } from 'react-native'
import React from 'react'


const Login = () => {


const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleFieldChange = (fieldName, text) => {
    setFormData({
      ...formData,
      [fieldName]: text,
    });
  };

  const handleSubmit = () => {
    //console.log('Formulaire soumis avec les données suivantes :', formData);
  };



  return (
    <View style={styles.Container}>
      <ScrollView>
            <Text style={styles.titre}>
              Connectez-vous!!!
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

            <View style={styles.fixToText}>
              <Button title="Se Connecter" color= "green"/>
              <Button title="Annuler" color= "red"/>
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
      borderWidth: 1,
      height: 35,
      width : 350,
      borderRadius: 6,
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 20,
    },
  });

export default Login