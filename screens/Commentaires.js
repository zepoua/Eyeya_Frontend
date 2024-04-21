import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, Image, ActivityIndicator, Button, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../services/config';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentModal = ({ isVisible, onClose, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nbre, setNbre] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offInternet, setOffInternet] = useState(false);
  const [sending, setSending] = useState(false);
  const [resending, setReSending] = useState(false);
  const [sendingText, setSendingText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const commentaire = () => {
    if (userId) {
      const apiUrl = `${apiConfig.apiUrl}/commentaire/${userId}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setComments(data);
          if (data.length < 10) {
            setNbre(`0${data.length}`);
          } else {
            setNbre(data.length.toString());
          }
        })
        .catch(error => {
          setOffInternet(true)
        }).finally(()=>setLoading(false))
    }
  };

  const get = () => {
    setLoading(true);
    commentaire();
  }

  useFocusEffect(
    React.useCallback(() => {
      get();
    }, [userId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      commentaire();
      setRefreshing(false);
      setSending(false)
    }, 2000);
  };

  const handleRetry = () => {
    setOffInternet(false);
    setLoading(true);
    commentaire();
  };

  const handleAddComment = async () => {
    const comment = newComment;
    setSendingText(newComment);
    setSending(true);
    setNewComment('');

    const storedData = await AsyncStorage.getItem('formDataToSend');

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);

      const formDataToSend = {
        user_id: userId,
        client_id: parsedData.id,
        commentaire_lib: comment,
      };

      const apiUrl = `${apiConfig.apiUrl}/enreg_commentaire`;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      };

      fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status == 'success') {
            setSendingText('')
            setSending(false)
            commentaire();
          } 
        })
        .catch(error => {
          setReSending(true)
        })
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
        
    if (diff < 60 * 1000) {
      return 'Maintenant';
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return 'Hier';
    } else {
      // Si c'est plus vieux, retournez la date
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };

  const resend = async () => {
    setReSending(false)
    setSending(true)

    const storedData = await AsyncStorage.getItem('formDataToSend');

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);

      const formDataToSend = {
        user_id: userId,
        client_id: parsedData.id,
        commentaire_lib: sendingText,
      };

      const apiUrl = `${apiConfig.apiUrl}/enreg_commentaire`;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      };

      fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status == 'success') {
            setSendingText('')
            setSending(false)
            commentaire();
          } 
        })
        .catch(error => {
          setReSending(true)
        })
    }
  }

  return (
    <View>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => onClose()}
        scrollable={true} // Ajoutez cette ligne
        onSwipeComplete={onClose} // Ajoutez cette ligne
        swipeDirection="down">
        <View style={{ flex: 1, justifyContent: 'flex-end', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
        <View style={{ backgroundColor: '#F5F7EB',borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>

          <TouchableOpacity
            style={{padding: 16, alignItems: 'center', }}
            onPress={onClose}>
            <Text stle={{color:'#361313', fontWeight:'bold', fontSize:14}}>Fermer</Text>
          </TouchableOpacity>
          <View style={{ borderBottomWidth:1, width:'100%', marginBottom:15, borderColor:'gray' }}>
            <Text style={{textAlign:'center', color:'black', fontSize:18, fontWeight:'bold'}}>{nbre} Commentaire(s)</Text>
         </View>
        </View>
        <View style={{ backgroundColor: '#F5F7EB', padding: 16,}}>
          {loading ? (
            <View style={styles.loadingContainer}>          
              <ActivityIndicator size="small" color="#3792CE" />
              <Text style={{color:'black'}}>chargement...</Text>
            </View>
          ): offInternet ? (
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color:'black', marginBottom:5}}>Erreur de connexion</Text>
              <Button title='Reessayer' color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }}></Button>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => (item.id != null ? item.id.toString() : Math.random().toString())}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#3792CE" 
                />
              }
              renderItem={({ item }) => (
                <View key={item.id != null ? item.id.toString() : Math.random().toString()} style={{ marginBottom: 15, flexDirection: 'row' }}>
                  <View style={styles.container}>
                    <Image
                      source={{ uri: `${apiConfig.imageUrl}/${item.icone}` }}
                      style={styles.circleImage}
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.client}</Text>
                    <Text style={{ color: 'black' }}>{item.commentaire}</Text>
                    <Text style={styles.dateText}>{formatDateTime(item.date)}</Text>

                  </View>
                </View>
              )}
            />
          )}

          {sending && (
            <View style={{flexDirection:'row', padding: 10, marginBottom: 5, alignSelf:'flex-start'}}>
              <View style={styles.sending_text}>
                <Text style={styles.messageText}>{sendingText}</Text>
              </View>
              {resending ? (
                <Icon name="refresh" size={25} color="#940606E5" onPress={resend}/>
              ) : (
                <ActivityIndicator size="small" color="#3792CE"/>
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              style={{ backgroundColor: 'white', flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 15, padding: 8 }}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              style={{ marginLeft: 8 }}
              disabled={!newComment.trim()} // Désactiver si le champ est vide
            >
              <Icon name="send" size={20} color={newComment.trim() ? '#4CAF50' : 'gray'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </View>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  container: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sending_text: {
    backgroundColor: '#91DA6679',
    borderRadius: 8,
    maxWidth: '80%',
    padding:5,
    marginRight:10
  },
  messageText: {
    fontSize: 12,
    color:'black',
  },
  circleImage: {
    width: 33,
    height: 33,
    borderRadius: 50,
  },
  dateText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
});
