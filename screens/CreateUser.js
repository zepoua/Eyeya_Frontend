import { View, Text, ScrollView, TextInput, StyleSheet, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native-windows';


const CreateUser = () => {

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        nom_entreprise:'',
        email: '',
        password: '',
        adresse: '',
        position: '',
        telephone1: '',
        telephone2: '',
        qualification: '',
        experience: '',
        description: '',});

    const [domaines, setDomaines] = useState([]);
      // État pour stocker la valeur sélectionnée dans la liste déroulante
    const [selectedDomaine, setSelectedDomaine] = useState('');
    
    
      // Effectuez une requête fetch pour obtenir les données des domaines
    useEffect(() => {
        // Remplacez cette URL par l'URL de votre API qui fournit les données des domaines
        const apiUrl = 'http://172.16.2.62:8000/api/domaine';
    
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            setDomaines(data);
        })
        .catch((error) => {
            console.error('Erreur lors de la requête :', error);
        });
    }, []);
    
    const handleFieldChange = (fieldName, text) => {
        setFormData({
          ...formData,
          [fieldName]: text,
        });
    };
    
    const handleSubmit = () => {
       
        const formDataToSend = {
            nom_entreprise: formData.nom_entreprise,
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            password: formData.password,
            adresse: formData.adresse,
            position: formData.position,
            telephone1: formData.telephone1,
            telephone2: formData.telephone2,
            qualification: formData.qualification,
            experience: formData.experience,
            description: formData.description,
            image1: formData.image1,
            image2: formData.image2,
            image3: formData.image3,
            domaine_id: selectedDomaine,
          };
          const apiUrl = 'http://172.16.2.62:8000/api/user';
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
          };
      
          // Effectuez la requête fetch vers votre API
          fetch(apiUrl, requestOptions)
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
                if (data == true){
                    setFormData ({
                        nom: '',
                        prenom: '',
                        nom_entreprise:'',
                        email: '',
                        password: '',
                        adresse: '',
                        position: '',
                        telephone1: '',
                        telephone2: '',
                        qualification: '',
                        experience: '',
                        description: '',
                        image1: '',
                        image2: '',
                        image3: ''});
                        setSelectedDomaine('');        
                }else{
                    Alert.alert(data);
                    console.log(data);
                }
            })
            .catch((error) => {
              console.error('Erreur :', error);
              // Gérez les erreurs ici, par exemple, affichez un message d'erreur à l'utilisateur
            });
    };
    
    const handleReset = () => {
        setFormData ({
            nom: '',
            prenom: '',
            nom_entreprise:'',
            email: '',
            password: '',
            adresse: '',
            position: '',
            telephone1: '',
            telephone2: '',
            qualification: '',
            experience: '',
            description: '',
            image1: '',
            image2: '',
            image3: ''});
            setSelectedDomaine('');     
      }


 
    return (
        <View style={styles.Container}>

            <ScrollView>

                <Text style={styles.titre}>
                    Inscription Professionnel
                </Text >

                <Text style={styles.libelle}>
                    Nom
                </Text >
                <TextInput 
                    placeholder='Entrez votre nom' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(text) => handleFieldChange('nom', text)}/>

                <Text style={styles.libelle}>
                    Prenom
                </Text>
                <TextInput 
                    placeholder='Entrez votre Prenom' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(text) => handleFieldChange('prenom', text)}/>                
                    
                <Text style={styles.libelle}>
                    Nom de l'entreprise
                </Text>
                <TextInput 
                    placeholder='Entrez Le nom de votre entreprise' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.nom_entreprise}
                    onChangeText={(text) => handleFieldChange('nom_entreprise', text)}/>

                <Text style={styles.libelle}>
                    Adresse Mail
                </Text>
                <TextInput 
                    placeholder='Votre Adresse mail' 
                    inputMode='email' 
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleFieldChange('email', text)}/>

                <Text style={styles.libelle}>
                    Mot de passe
                </Text>
                <TextInput 
                    placeholder='Entrez un mot de passe' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => handleFieldChange('password', text)}/>

                <Text style={styles.libelle}>
                    Adresse
                </Text>
                <TextInput 
                    placeholder='Entrez votre adresse' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.adresse}
                    onChangeText={(text) => handleFieldChange('adresse', text)}/>

                <Text style={styles.libelle}>
                    Geolocalisation
                </Text>
                <TextInput 
                    placeholder='Entrez votre position' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.position}
                    onChangeText={(text) => handleFieldChange('position', text)}/>

                <Text style={styles.libelle}>
                    Telephone 1
                </Text>
                <TextInput 
                    placeholder='Numero de telephone' 
                    inputMode='tel' 
                    style={styles.input}
                    value={formData.telephone1}
                    onChangeText={(text) => handleFieldChange('telephone1', text)}/>

                <Text style={styles.libelle}>
                    Telephone 2
                </Text>
                <TextInput 
                    placeholder='autre numero de telephone (optionnel)' 
                    inputMode='tel' 
                    style={styles.input}
                    value={formData.telephone2}
                    onChangeText={(text) => handleFieldChange('telephone2', text)}/>    
    
                <Text style={styles.libelle}>
                    Qualifications
                </Text>
                <TextInput 
                    placeholder='vos qualifications' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.qualification}
                    onChangeText={(text) => handleFieldChange('qualification', text)}/>

                <Text style={styles.libelle}>
                    Experiences
                </Text>
                <TextInput 
                    placeholder='vos experiences' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.experience}
                    onChangeText={(text) => handleFieldChange('experience', text)}/>
                
                <Text style={styles.libelle}>
                    Description
                </Text>
                <TextInput 
                    placeholder='description de votre entreprise' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.description}
                    onChangeText={(text) => handleFieldChange('description', text)}/>               
               
                <Text style={styles.libelle}>
                    Image 1
                </Text>
                <TextInput 
                    placeholder='ajoutez une image' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.image1}
                    onChangeText={(text) => handleFieldChange('image1', text)}/>

                <Text style={styles.libelle}>
                    Image 2
                </Text>
                <TextInput 
                    placeholder='ajoutez une image' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.image2}
                    onChangeText={(text) => handleFieldChange('image2', text)}/>

                <Text style={styles.libelle}>
                    Image 3
                </Text>
                <TextInput 
                    placeholder='ajoutez une image' 
                    inputMode='text' 
                    style={styles.input}
                    value={formData.image3}
                    onChangeText={(text) => handleFieldChange('image3', text)}/>

                <Text style={styles.libelle}>Sélectionnez un domaine :</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={selectedDomaine}
                        onValueChange={(itemValue, itemIndex) => setSelectedDomaine(itemValue)}
                    >
                        <Picker.Item label="Sélectionnez un domaine" value="" />
                        {domaines.map((domaine) => (
                        <Picker.Item
                            style={styles.input}
                            key={domaine.id}
                            label={domaine.domaine_lib}
                            value={domaine.id.toString()}
                        />
                        ))}
                    </Picker>
                    <Text style={styles.libelle}>Domaine sélectionné : {selectedDomaine}</Text>

                <View style={styles.fixToText}>
                <Button title="Enregistrer" color= "green" onPress={handleSubmit}/>
                <Button title="Annuler" color= "red" onPress={handleReset}/>
                </View>
            </ScrollView>
        </View>
    
      );
}

const styles = StyleSheet.create({
    Container: {
      margin: 20
    },
    libelle: {
      fontSize: 20,
      fontFamily: 'Cochin',
      fontWeight: 'bold',
      color:'black',
      marginTop: 9,
      marginBottom: 6,
    },
    titre: {
      fontSize: 40,
      fontFamily: 'algerian',
      fontWeight: 'bold',
      color:'darkblue',
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 15,
    },
    input:{
      height: 35,
      width : 350,
      borderRadius: 6,
      borderBottomWidth:1,
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 20,
    },
  });

export default CreateUser