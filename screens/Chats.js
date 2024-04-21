import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Button, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from './test';

const Chats = ({navigation}) => {
  const [clientData, setClientData] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offInternet, setOffInternet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const fetchData = async () => {
    const storedData = await AsyncStorage.getItem('formDataToSend');
    const parsedData = JSON.parse(storedData);

    if (parsedData && parsedData.id) {
      setClientData(parsedData);

      const apiUrl = `${apiConfig.apiUrl}/discussions/${parsedData.id}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.discussions) {
            setDiscussions(data.discussions);
          } 
        })
        .catch((error) => {
          setOffInternet(true)
        }).finally(() => setLoading(false));
        
    } 
  }; 

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [navigation])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    fetchData();
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
  
  
    if (diff < 60 * 1000) {
      return 'Maintenant';
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `il y a ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return 'Hier';
    } else {
      // Si c'est plus vieux, retournez la date
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };

  const handleDiscussionPress = async (discussion) => {
      navigation.navigate('DetailMessages', {
        interlocuteurId: discussion.interlocuteur_id,
        clientId:clientData.id,
      });
  };



  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleDiscussionPress(item)}
    >
      <Image source={{ uri: `${apiConfig.imageUrl}/${item.avatar}` }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.nomPrenom}>{item.nom} {item.prenom}</Text>
        <Text style={styles.dernierMessage}>{`${item.dernier_message.substring(0, 50)}`}...</Text>
        <Text style={styles.date}>{formatDateTime(item.date_dernier_message)}</Text>
      </View>
      <View style={styles.badgeContainer}>
        {item.nombre_messages_non_lus > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.nombre_messages_non_lus}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3792CE" />
          <Text style={{color:'black'}}>chargement...</Text>
        </View>
      ): offInternet ? (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
        <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
      </View>
      ) : discussions.length === 0 ?(
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="wechat" size={50} color={'#3792CE'} />
          <Text style={{ textAlign: 'center', color: 'black', fontSize: 14 }}>
            Aucune discussion...
          </Text>
        </View>
          ) : (
            <FlatList
              data={discussions}
              keyExtractor={(item) => item.interlocuteur_id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#3792CE"
                />
              }/>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFFFFF',
    paddingTop:10
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nomPrenom: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'black'
  },
  dernierMessage: {
    color: '#131212',
  },
  date: {
    color: '#aaa',
    fontSize: 12,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'green',
    borderRadius: 25,
    width:30,
    height:30,
    padding: 5,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign:'center'
  },
});

export default Chats;
