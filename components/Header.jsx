import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Icons for back & logout buttons

const Header = ({ title, showBackButton = false, onBackPress, rightComponent }) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

   
      {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: 20,
    
  
    backgroundColor: 'green',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rightComponent: {
    position: 'absolute',
    right: 20, 
  },
});
