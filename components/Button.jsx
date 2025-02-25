import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ buttonStyle, textStyle, title, onPress = () => {}, loading = false, hasShadow = false }) => {
  return (
    <Pressable 
      style={[styles.button, hasShadow && styles.shadow, buttonStyle]} 
      onPress={onPress} 
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>Getting Started</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#32CD32', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
       
       
        
      },
      
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Button;
