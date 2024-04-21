import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import apiConfig from '../services/config';

const ImageUploadScreen = () => {
  const [Image, setImage] = useState('');


  const selectImage = () => {
    ImagePicker.launchImageLibrary(
        {
            title: 'Sélectionnez une image',
            storageOptions: {
                skipBackup: true,
                path: '',
            },
        },
        (response) => {
          if (!response.didCancel && !response.error) {
            const { uri, type, fileName: name } = response.assets[0];
            const source = { uri, type, name };
            uploadImage(source);
            }
        }
    );
  };

  const uploadImage = async (source) => {
    try {
      const formData = new FormData();
      formData.append('image', source);  
      const response = await fetch(`${apiConfig.apiUrl}/images`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Enregistrez l'URL retournée dans la base de données ou effectuez toute autre action nécessaire
        //console.log('Image URL:', data.imageUrl);
        setImage(data.imageUrl);
      } else {
      }
    } catch (error) {
    }
  };

  /*const handleSubmit = (source) => {
    const apiUrl = `${apiConfig.apiUrl}/images`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(source),
    };
  
    // Effectuez la requête fetch vers votre API
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'success') {
          setError(data.message);
          setModalVisible(true);
          navigation.navigate('ConfirmationClient', { formDataToSend });
          setFormData ({
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
          })
        } else {
          setError(data.message);
          setModalVisible(true);
        }
      }).catch((error) => {console.error('Erreur :', error.message);})
        .finally(() => setLoading(false));
};*/

  return (
    <View>
      {Image && <Image source={{ uri: Image }} style={{ width: 200, height: 200 }} />}
      <Button title="Sélectionner une image" onPress={selectImage} />
    </View>

  );
};

export default ImageUploadScreen;

