import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, ScrollView, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StarRating from 'react-native-star-rating'; // Vous pouvez utiliser une bibliothèque pour les étoiles


const Recherche = ({navigation}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Chargez la liste initiale des professionnels au montage de la page
    fetch('http://192.168.1.242:8000/api/user')
      .then(response => response.json())
      .then(initialData => {
        setData(initialData);
        setFilteredData(initialData);
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
      
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setFilteredData(data);
    }, [data])
  );

  const handleSearch = (text) => {
    setSearchText(text);

    // Effectuez une requête à votre API pour obtenir les données filtrées
    if (text.trim() === '') {
      // Si le champ de recherche est vide, affichez les données initiales
      setFilteredData(data);
    } else {
      try {
        const apiUrl = `http://192.168.1.242:8000/api/search?search=${searchText}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(filtered => setFilteredData(filtered))
      } catch (error) {
        console.log('Erreur lors de la requête API :', error);
      }
      // Sinon, effectuez une recherche
      }
  };

  const details = (professionalId) =>{ 
    navigation.navigate('Details', { professionalId });
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={{
            height: 40,
            borderColor: '#9B1126',
            borderWidth: 2,
            margin: 10,
            padding: 5,
            borderRadius: 18,
          }}
          placeholder="Rechercher..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
  
      <ScrollView>
        {searchText.trim() !== '' && filteredData.length === 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 250,}}>
            <Text style={{textAlign:'center', fontWeight:'bold', fontSize: 18}}>Aucun résultat trouvé</Text>
            <Image source={require('../assets/images/search.png')} style={{ width: 100, height: 100 }} />
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredData.map((professional, index) => (
              <View key={index} style={styles.profsContainer}>
                <TouchableHighlight
                  key={`TouchableHighlight-${index}`}
                  onPress={() => details(professional.id)}
                  activeOpacity={0.8}
                  underlayColor="#EFF7F6E5"
                  style={styles.touchableHighlight}
                >
                 <View style={styles.profs}>
                  <Image
                    source={require('../assets/images/test2.jpg')}
                    style={{
                      width: '100%',
                      height: 100,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                  />
                  <View style={{ flex: 1, alignItems: 'center', marginTop: -60 }}>
                    <Image
                      source={require('../assets/images/test.jpg')}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                      }}
                    />
                  </View>
                  <View style={styles.text_view}>
                    <Text style={styles.text}>{`${professional.nom} ${professional.prenom}`}</Text>
                    <Text style={styles.text}>{`${professional.nom_entreprise}`}</Text>
                    <Text style={styles.text}>{professional.domaine?.domaine_lib ?? professional.domaine_lib}</Text>
                    <StarRating
                      disabled
                      starSize={23}
                      maxStars={5}
                      rating={professional.moyenne_notations}
                      fullStarColor={'#FDE03A'}
                      halfStar={'#494112'}/>   
                  </View>
                </View>
                </TouchableHighlight>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

    </View>
  );
  
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7D6', // Couleur de fond
  },
  profsContainer: {
    flexDirection: 'row', 
    margin: 10,// Change to 'column' if you want professionals displayed vertically
    justifyContent: 'space-between'
  },
  container1: {
    flex: 1,
  },

  profs:{
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: 'gray',
    height: 280,
    width:'100%',
    backgroundColor: 'white'
  },
  text_view:{
    flex: 1,
    flexDirection: 'colunn',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
    height: 60,
  },

  text:{
    fontWeight: 'bold',
    fontSize: 17,
    color: '#062153',
    textAlign: 'center',
  },
  touchableHighlight: {
    width:'48%'
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  profsContainer: {
    width: '48%', // 48% pour que deux éléments tiennent sur une ligne
    marginBottom: 10,
  },

  touchableHighlight: {
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default Recherche;