import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, Image} from 'react-native';
import { Alert } from 'react-native-windows';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CommentModal = ({ isVisible, onClose, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    if (userId) {
      const apiUrl = `http://192.168.1.242:8000/api/commentaire/${userId}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setComments(data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        });
    }
  }, [userId]);

 const handleAddComment = async () => {
  try {
    const storedData = await AsyncStorage.getItem('formDataToSend');

    if (storedData !== null) {
      // Convertir la chaîne JSON en objet JavaScript
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);

      const formDataToSend = {
        user_id: userId,
        client_id: parsedData.id, // Utilisez parsedData au lieu de userData ici
        commentaire_lib: newComment,
      };

      const apiUrl = 'http://192.168.1.242:8000/api/enreg_commentaire';
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
          setComments((prevComments) => [...prevComments, data]);
          console.log(comments)
          setNewComment('')       
        })
        .catch((error) => {
          console.error('Erreur :', error.message);
        });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};


  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => onClose()}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#ECF1D2', padding: 16,}}>
        <FlatList
            data={comments}
            keyExtractor={item => (item.id != null ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => (
                <View key={item.id != null ? item.id.toString() : Math.random().toString()} style={{ marginBottom: 15, flexDirection: 'row'}}>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/test.jpg')} // Remplacez cela par le chemin de votre image
                        style={styles.circleImage} />
                </View>
                <View style={{flex: 1, flexDirection: 'column', marginLeft: 5}}>
                    <Text style={{color: 'black', fontWeight: 'bold'}}>{item.client}</Text>
                    <Text style={{color: 'black'}}>{item.commentaire}</Text>
                </View>
                </View>
            )}
            />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              style={{ backgroundColor:'white', flex: 1, borderWidth: 1, borderColor: 'black', borderRadius: 15, padding: 8 }}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity onPress={handleAddComment} style={{ marginLeft: 8 }}>
              <Text>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: 'white', padding: 16, alignItems: 'center',  }}
          onPress={onClose}
        >
          <Text style={{fontWeight: 'bold', color:'red'}}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
    container: {
    },
    circleImage: {
      width: 33,
      height: 33,
      borderRadius: 50, // La moitié de la largeur ou de la hauteur pour obtenir un cercle
    },
  });
  