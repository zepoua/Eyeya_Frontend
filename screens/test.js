// CustomModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-windows';

const CustomModal = ({ isVisible, onClose, message }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
     <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ color: 'black', fontWeight:'bold' }}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 16 }}>
            <Text style={{ color: 'blue' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth:'95%'
  },
})

export default CustomModal;
