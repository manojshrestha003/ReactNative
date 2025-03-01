import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

import { getUserImageSource } from '../services/imageService';

const Avatar = ({ uri }) => {
  return (
    <View>
      <Image 
        source={getUserImageSource(uri)}  
        transition={100} 
        style={styles.avatar}
        contentFit="cover" // ✅ Use contentFit instead of resizeMode
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    width: 40, 
    height: 40, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: '#ddd',
    overflow: 'hidden',
  },
});
