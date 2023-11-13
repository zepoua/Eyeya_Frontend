import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import apiConfig from '../services/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const ListMessages = ({ route, navigation }) => {
    const { clientId, interlocuteurId} = route.params;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

   
    const inputMessage = (text) =>{
        setInput(text);
    }

    // Mock data for testing
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiConfig.apiUrl}/discussions/${clientId}/${interlocuteurId}`);
        const data = await response.json();
        setMessages(data.messages);
        console.log('done');

        /*const pusher = Pusher.getInstance();
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
            const readAt = message.id_dest === clientId ? new Date() : null;
            const messageAvecInfos = {
              ...message,
              interlocuteur_nom: messages.interlocuteur_nom,
              interlocuteur_prenom: messages.interlocuteur_prenom,
              interlocuteur_avatar: messages.interlocuteur_avatar,
              read_at: readAt,
            };
            setMessages((prevMessages) => [...prevMessages, messageAvecInfos]);

          },
        });*/
        } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {    
            fetchMessages();
          }, [setMessages, clientId, input, setInput, handleSend ])
          );

      const renderItem = ({ item }) => {
        const isClient = item.id_exp === clientId;
      
        return (
          <View style={[styles.messageContainer, isClient ? styles.clientMessage : styles.interlocuteurMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.dateText}>{formatDateTime(item.date_envoi)}</Text>
          </View>
        );
      };
      

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

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleSend = () => {
        const formDataToSend ={
            exp_id: clientId,
            dest_id: interlocuteurId,
            message: input,
        }

        const apiUrl = `${apiConfig.apiUrl}/message`
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
              console.log(data.message);
              if (data.status == 'success') {
                fetchMessages();
              } 
            }).catch((error) => {
              console.error('Erreur :', error.message);
            });
        setInput('')
    }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        {messages.length > 0 && (
          <Image source={{ uri: messages[0]?.interlocuteur_avatar }} style={styles.avatar} />
        )}        
      <View style={styles.headerTextContainer}>
        <Text style={styles.nomPrenom}>{messages[0]?.interlocuteur_nom} {messages[0]?.interlocuteur_prenom}</Text>
        </View>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.messagesList}
         // Pour afficher les messages du bas vers le haut
      />

      {/* Input pour envoyer un nouveau message */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Écrire un message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={[styles.sendButton, input === '' && styles.disabledButton]}
          onPress={input !== '' ? handleSend : null}
          disabled={input === ''}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white'
    },

    backButton: {
        marginRight: 10,
      },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    headerTextContainer: {
      flex: 1,
    },
    nomPrenom: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    messagesList: {
      flex: 1,
      left:15,
      marginRight:25,
      top:10
    },
    messageContainer: {
      padding: 10,
      borderRadius: 8,
      maxWidth: '80%',
      marginBottom: 5,
    },
    clientMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#b2ffc1',
    },
    interlocuteurMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#F1E4E4', // Couleur pour les messages de l'interlocuteur
    },
    messageText: {
      fontSize: 16,
      color:'black',
      fontWeight:'bold'

    },
    dateText: {
      fontSize: 12,
      color: '#988',
      marginTop: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 10,
      marginBottom:10
    },
    sendButton: {
        backgroundColor: '#4CAF50', // Couleur pour le bouton d'envoi
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      disabledButton: {
        backgroundColor: '#ccc', // Couleur pour le bouton désactivé
      },
      sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
  });

export default ListMessages;
