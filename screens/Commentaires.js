import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, Image, ActivityIndicator, Button, RefreshControl, Dimensions } from 'react-native';
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
          setOffInternet(true);
        }).finally(() => setLoading(false));
    }
  };

  const get = () => {
    setLoading(true);
    commentaire();
  };

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
      setSending(false);
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
          if (data.status === 'success') {
            setSendingText('');
            setSending(false);
            commentaire();
          }
        })
        .catch(error => {
          setReSending(true);
        });
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
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };

  const resend = async () => {
    setReSending(false);
    setSending(true);

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
          if (data.status === 'success') {
            setSendingText('');
            setSending(false);
            commentaire();
          }
        })
        .catch(error => {
          setReSending(true);
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
        onSwipeComplete={onClose}
        swipeDirection="down"
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.modalContent}>

            <TouchableOpacity
              style={{ padding: 16, alignItems: 'center' }}
              onPress={onClose}
            >
              <Text style={{ color: '#361313', fontWeight: 'bold', fontSize: 14 }}>Fermer</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.headerText}>{nbre} Commentaire(s)</Text>
            </View>

            <View style={styles.content}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3792CE" />
                  <Text style={{ color: 'black' }}>chargement...</Text>
                </View>
              ) : offInternet ? (
                <View style={styles.errorContainer}>
                  <Text style={{ color: 'black', marginBottom: 5 }}>Erreur de connexion</Text>
                  <Button title="Reessayer" color={'#888B8B'} onPress={handleRetry} titleStyle={{ color: 'black' }} />
                </View>
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={item => item.id?.toString() || Math.random().toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#3792CE"
                    />
                  }
                  renderItem={({ item }) => (
                    <View key={item.id?.toString() || Math.random().toString()} style={styles.commentContainer}>
                      <View style={styles.container}>
                        <Image
                          source={{ uri: `${apiConfig.imageUrl}/${item.icone}` }}
                          style={styles.circleImage}
                        />
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>{item.client}</Text>
                        <Text style={styles.commentText}>{item.commentaire}</Text>
                        <Text style={styles.dateText}>{formatDateTime(item.date)}</Text>
                      </View>
                    </View>
                  )}
                />
              )}

              {sending && (
                <View style={styles.sendingContainer}>
                  <View style={styles.sendingTextContainer}>
                    <Text style={styles.messageText}>{sendingText}</Text>
                  </View>
                  {resending ? (
                    <Icon name="refresh" size={25} color="#940606E5" onPress={resend} />
                  ) : (
                    <ActivityIndicator size="small" color="#3792CE" />
                  )}
                </View>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  style={styles.sendButton}
                  disabled={!newComment.trim()} // Désactiver si le champ est vide
                >
                  <Icon name="send" size={20} color={newComment.trim() ? '#4CAF50' : 'gray'} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#F5F7EB',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '70%', // Limite la hauteur à 70% de l'écran
  },
  header: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 15,
    borderColor: 'gray',
  },
  headerText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#888B8B',
  },
  container: {
    marginRight: 10,
    justifyContent: 'center',
  },
  circleImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: 'black',
  },
  commentText: {
    color: 'black',
  },
  dateText: {
    marginTop: 5,
    color: '#808080',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 10,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#888B8B',
  },
  input: {
    flex: 1,
    color: 'black',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sendingTextContainer: {
    backgroundColor: '#DBDADA',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  messageText: {
    color: 'black',
  },
});
