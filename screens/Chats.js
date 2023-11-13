import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const Chats = ({navigation}) => {
  const [clientData, setClientData] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [pusher, setPusher] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
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
                } else {
                  console.error('La réponse ne contient pas la propriété attendue.');
                }
              })
              .catch((error) => {
                console.error('Erreur lors de la requête :', error);
              });
  
            const pusher = Pusher.getInstance();
            await pusher.init({
              apiKey: 'bb47b38a4b13613c16ef',
              cluster: 'eu',
            });
            await pusher.connect();
            await pusher.subscribe({
              channelName: 'chat',
             
                  eventName: "App\\Events\\MessagesEvent",
                  onEvent: (event: PusherEvent) => {
                    console.log(`New Message Event received: ${JSON.stringify(event)}`);
                    const eventData = JSON.parse(event.data);
                    const message = eventData.message;
            
                    setDiscussions((prevDiscussions) => {
                      const updatedDiscussions = prevDiscussions.map((discussion) => {
                        const newUnreadCount = parseInt(discussion.nombre_messages_non_lus, 10) + 1;
                    
                        return discussion.interlocuteur_id === message.id_exp
                          ? {
                              ...discussion,
                              dernier_message: message.message,
                              date_dernier_message: new Date(message.date_envoi),
                              nombre_messages_non_lus: newUnreadCount,
                            }
                          : discussion;
                      });
                      return updatedDiscussions;
                    });
                },
               
            });
            
          } else {
            console.error('Données stockées non valides ou manquantes.');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      };
  
      fetchData();
  
      // Déconnexion de Pusher lorsque le composant est démonté
      return () => {
        const pusher = Pusher.getInstance();
        if (pusher) {
          pusher.disconnect();
        }
      };
    }, [navigation])
  );
  
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 1000) {
      return 'Maintenant';
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return 'Aujourd\'hui';
    } else if (diff < 2 * 24 * 60 * 60 * 1000) {
      return 'Hier';
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} ${days > 1 ? 'jours' : 'jour'} ago`;
    } else {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };

  const handleDiscussionPress = async (discussion) => {
    // Mettre à jour l'attribut read_at
    const apiUrl = `${apiConfig.apiUrl}/updateReadStatus/${clientData.id}/${discussion.interlocuteur_id}`;
    try {
      await fetch(apiUrl, { method: 'PUT' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de lecture :', error);
    }

    // Naviguer vers une autre page avec les détails de l'interlocuteur
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
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.nomPrenom}>{item.nom} {item.prenom}</Text>
        <Text style={styles.dernierMessage}>{item.dernier_message}</Text>
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
      <FlatList
        data={discussions}
        keyExtractor={(item) => item.interlocuteur_id.toString()}
        renderItem={renderItem}
      />
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
    fontSize: 16,
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
