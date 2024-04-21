import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'


const LoginType = ({navigation}) => {

  return (
    <View style={styles.Container}>
      <View>
        <Text style={styles.titre}>
        Choisissez Votre Type de Compte et connectez-vous !
        </Text >
        <View style={{ flexDirection: 'column', top:30}}>
          <TouchableHighlight 
            activeOpacity={0.8} 
            underlayColor='#7698F3'
            onPress={() => navigation.navigate('Login')}
            style={{backgroundColor:'#3792CE', height:50, width:'100%', borderRadius:25, justifyContent:'center', alignItems:'center', marginBottom:10}}>
            <Text style={{ color:'white', fontSize:16}}>Compte Professionnel</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            activeOpacity={0.8} 
            underlayColor='#A5B1AFE5' 
            onPress={() => navigation.navigate('LoginClient')}
            style={{backgroundColor:'#5C5959', height:50, width:'100%', borderRadius:25, justifyContent:'center', alignItems:'center'}}>
            <Text style={{ color:'white', fontSize:16}}>Compte Client</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    Container: {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'white'
    },
    titre: {
      fontSize: 20,
      fontFamily: 'algerian',
      fontWeight: 'bold',
      color:'black',
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 15
    }
  });

export default LoginType