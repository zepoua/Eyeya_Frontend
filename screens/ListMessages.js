import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator, Button, RefreshControl } from 'react-native';
import apiConfig from '../services/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

import pusher from '../services/pusher'

const ListMessages = ({ route, navigation }) => {
  const { clientId, interlocuteurId} = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendingText, setSendingText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offInternet, setOffInternet] = useState(false);
  const [resending, setReSending] = useState(false);
  
  const inputMessage = (text) =>{
      setInput(text);
  }


  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiConfig.apiUrl}/discussions/${clientId}/${interlocuteurId}`);
      const data = await response.json();
      setMessages(data.messages);
      setLoading(false)
        pusher.subscribe({
        channelName: "message",
        onEvent: (event: PusherEvent) => {
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
      });
      
      } catch (error) {
        setOffInternet(true)
      }
  };

  useFocusEffect(
    React.useCallback(() => {    
      fetchMessages();
    }, [setMessages, clientId, input, setInput, handleSend ])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchMessages();
      setRefreshing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    fetchMessages();
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
    
  const handleGoBack = () => {
      navigation.goBack();
  };

  const handleSend = () => {
    const msg = input;
    setSendingText(input);
    setSending(true);
    setInput('');

    const formDataToSend ={
        exp_id: clientId,
        dest_id: interlocuteurId,
        message: msg,
    }
    const apiUrl = `${apiConfig.apiUrl}/enreg_message`
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataToSend),
    };
    
      // Effectuez la requête fetch vers votre API
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 'success') {
          setSendingText('')
          setSending(false)
          fetchMessages();
        }
      }).catch(error => {
        setReSending(true)
      })
  }

  const resend =  () => {
    setReSending(false)
    setSending(true)

    const formDataToSend ={
      exp_id: clientId,
      dest_id: interlocuteurId,
      message: sendingText,
    }

    const apiUrl = `${apiConfig.apiUrl}/enreg_message`
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
          setSendingText('')
          setSending(false)
          fetchMessages();
        } 
      }).catch((error) => {
        setReSending(true)
      })

  }

  const renderItem = ({ item }) => {
    const isClient = item.id_exp === clientId;

    return (
      <View style={[styles.messageContainer, isClient ? styles.clientMessage : styles.interlocuteurMessage]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.dateText}>{formatDateTime(item.date_envoi)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {messages.length > 0 && (
          <Image source={{ uri: `${apiConfig.imageUrl}/${messages[0]?.interlocuteur_avatar}`}} style={styles.avatar} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.nomPrenom}>{messages[0]?.interlocuteur_nom} {messages[0]?.interlocuteur_prenom}</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3792CE" />
          <Text style={{color:'black'}}>chargement...</Text>
        </View>
      ) : offInternet ? (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
        <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
      </View>
      ) : (
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.messagesList}
        inverted={false} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3792CE"
          />
        } // Pour afficher les messages du bas vers le haut
      />
      )}

      {sending && (
        <View style={{flexDirection:'row', padding: 10, marginBottom: 5, alignSelf:'flex-end'}}>
          {resending ? (
            <Icon name="refresh" size={25} color="#940606E5" onPress={resend}/>
          ) : (
            <ActivityIndicator size="small" color="#3792CE"/>
          )}
            <View style={styles.sending_text}>
            <Text style={styles.messageText}>{sendingText}</Text>
          </View>
        </View>
      )}

      {/* Input pour envoyer un nouveau message */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Écrire un message..."
          value={input}
          onChangeText={inputMessage}
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
      backgroundColor:'#3792CE'
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
      fontSize: 14,
      fontWeight: 'bold',
      color:'white'
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
      backgroundColor: '#DADEF379',
    },
    sending_text: {
      backgroundColor: '#91DA6679',
      borderRadius: 8,
      maxWidth: '80%',
      padding:10,
      marginLeft:10
    },
    interlocuteurMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#F1E4E473', // Couleur pour les messages de l'interlocuteur
    },
    messageText: {
      fontSize: 14,
      color:'black',
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
