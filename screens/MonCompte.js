import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCompte from './UserCompte';
import ClientCompte from './ClientCompte';

const MonCompte = () => {

  const [dataPhone, setDataPhone] = useState({});
  const [load, setLoad] = useState(false);


  const getData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('formDataToSend');
        const parsedData = JSON.parse(storedData);
        setDataPhone(parsedData);  
        setLoad(true)    
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  
  let componentToRender = null;

  if (load) {
    if (Object.keys(dataPhone).length > 6) {
      componentToRender = <UserCompte/>;
    }else{
      componentToRender = <ClientCompte/>;
    }
  }

    if (Object.keys(dataPhone).length > 6) {
      componentToRender = <UserCompte/>;
    }

  return (
    <View style={styles.container}>
      {componentToRender}
    </View>
  );
  
}

export default MonCompte

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})