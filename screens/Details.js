// Details.js
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import CommentModal from './Commentaires';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles



const Details = ({ route, navigation }) => {
  const { professionalId } = route.params;
  const [professionals, setProfessionals] = useState([]);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const handleRating = () => {
    // Envoyer la note à votre API ici
    setRatingModalVisible(false);
  };


  useEffect(() => {
    // Remplacez cette URL par l'URL de votre API qui fournit les données des domaines
    const apiUrl = `http://192.168.1.242:8000/api/user/${professionalId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setProfessionals(data)    })
    .catch((error) => {
        console.error('Erreur lors de la requête DE USER :', error);
    });
}, [professionalId]);

  return (
    <View>
      <Modal visible={isRatingModalVisible} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 10, width: 300 }}>
          <Text style={{ fontSize: 18, marginBottom: 10, textAlign:'center', fontWeight:'bold', color:'black' }}>Donnez une note :</Text>
          <StarRating
            starSize={40}
            maxStars={5}
            rating={rating}
            fullStarColor={'#FDE03A'}
            selectedStar={(rating) => setRating(rating)}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity onPress={() => setRatingModalVisible(false)} style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRating} style={{ padding: 10, backgroundColor: '#FDE03A', borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Modal>
      <ScrollView>
        <View style={{flex:1, flexDirection: 'colunn',}}>
          <Image source={require('../assets/images/test2.jpg')} style={{ width: '100%', height: 250 }} />
          <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', marginBottom: 20,}}>
            <View style={{flex:1, flexDirection: 'row', marginBottom: 20, left: 25, top: 20}}>
              <TouchableOpacity onPress={() => setCommentModalVisible(true)} style={{marginRight:20}}>
                <Icon name="comment" size={35} color={'#1B0272'}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={{marginRight:20}}>
                <Icon name="comments" size={35} color={'#D81111'}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRatingModalVisible(true)}>
                <Icon name="star" size={35} color={'#FDE03A'}/>
              </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', right: 25, top:20 }}>
              <StarRating
                disabled
                starSize={30}
                maxStars={5}
                rating={professionals.moyenne_notations}
                fullStarColor={'#FDE03A'}
              />

            </View>
            <View>
            </View>
          </View>
        </View>
      <View style={styles.text_view}>
        <View style={{flex: 1, justifyContent: 'center', marginBottom: 15}}>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#380305', textAlign:'center'}}>{`${professionals.nom} ${professionals.prenom}`}</Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.text}>Domaine</Text>
            <Text style={styles.text_data}>{professionals.domaine?.domaine_lib ?? professionals.domaine_lib}</Text>
          </View>
          <View>
            <Text style={styles.text}>Nom de l'Entreprise</Text>
            <Text style={styles.text_data}>{`${professionals.nom_entreprise}`}</Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10}}>
          <Text>Description de l'Entreprise</Text>
          <Text>{`${professionals.description}`}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10}}>
          <Text>Qualifications Acquises </Text>
          <Text>{`${professionals.qualification}`}</Text>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10}}>
          <Text>Experiences de Travail</Text>
          <Text>{`${professionals.experience}`}</Text>
          <View style={{flex: 1, flexDirection: 'colunn', justifyContent: 'space-between', marginTop: 10}}>
          <Text>Coordonnees Personnelles</Text>
          <Text>{`${professionals.email}`}, +228{`${professionals.telephone1}`}, +228{`${professionals.telephone2}`}, {`${professionals.adresse}`}</Text>
        </View>
        </View>
        </View>
      </View>
      </ScrollView>
      <CommentModal isVisible={isCommentModalVisible} onClose={() => setCommentModalVisible(false)} userId={professionals.id}/>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    marginLeft: 18,
    marginRight: 18,

  },
  
  text_data:{
    fontWeight: 'bold',
    fontSize: 17,
    color: '#062153',
    width: '100%',
  },
  text:{
    fontSize: 17,
    color: '#0A0A0A',
  }
})
