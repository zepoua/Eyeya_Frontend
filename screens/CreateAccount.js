import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
const CreateAccount = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.input}>Selectionnez le type de compte que vous voulez creer !!!</Text>
      <View style={styles.button_container}>
        <View style={{ marginBottom: 10}}>
          <Button title="Compte Client" color='#190AC4' style={styles.button} onPress={() => navigation.navigate('CreateClient')}/>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button title="Compte Professionnel" color='#190AC4'  style={styles.button} onPress={() => navigation.navigate('CreateUser')}/>
        </View>      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Couleur de fond
  },

  input: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'green',

  },

  button_container: {
    flexDirection: 'colunn',
    justifyContent: 'space-between', 
  },

  button:{
    width: 300, 
    height: 30, 
    borderRadius: 5 
  }
  
})

export default CreateAccount;
