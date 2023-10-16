import React from 'react';
import { View, Image } from 'react-native';

const Etoile = ({ moyenneNotations }) => {
  // Fonction pour déterminer la couleur en fonction de la moyenne
  const getColor = (note) => {
    if (note >= 4.5) {
      return 'gold'; // Couleur pour une excellente note
    } else if (note >= 3.5) {
      return 'orange'; // Couleur pour une bonne note
    } else {
      return 'gray'; // Couleur pour une note moyenne ou inférieure
    }
  };

  // Nombre d'étoiles à afficher
  const nombreEtoiles = 5;

  // Calcul de la couleur en fonction de la moyenne
  const couleur = getColor(moyenneNotations);

  // Création des étoiles
  const etoiles = Array.from({ length: nombreEtoiles }, (_, index) => (
    <Image
      key={index}
      source={require('../assets/images/etoile.png')} // Utilisez votre image d'étoile ici
      style={{ width: 20, height: 20, tintColor: couleur }}
    />
  ));

  return <View style={{ flexDirection: 'row' }}>{etoiles}</View>;
};

export default Etoile;
