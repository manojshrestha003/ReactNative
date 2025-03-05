import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../contexts/authContext';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { getUserData } from '../../services/userService';
import * as ImagePicker from 'expo-image-picker'; 

import { Video as ExpoVideo } from 'expo-av'; 

const NewPost = () => {
  const { user } = useAuth();
  const [getUser, setGetUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const updateUserData = async (userId) => {
    try {
      const res = await getUserData(userId);
      setGetUser(res);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    updateUserData(user.id);
  }, []);

  // Function to open the image picker
  const openImageGallery = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri); 
        setSelectedVideo(null); 
      }
    }
  };

  // Function to open the video picker
  const openVideoGallery = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Pick video correctly
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedVideo(result.assets[0].uri);
        setSelectedImage(null); 
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Post" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar and User Info */}
        <View style={styles.headerSection}>
          <Avatar uri={getUser?.data?.image} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{getUser?.data?.name}</Text>
            <Text style={styles.publicText}>Public</Text>
          </View>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind!"
          multiline
        />

        {/* Media Options */}
        <View style={styles.mediaOptions}>
          <TouchableOpacity style={styles.optionButton} onPress={openImageGallery}>
            <MaterialIcons name="image" size={24} color="green" />
            <Text style={styles.optionText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={openVideoGallery}>
            <Entypo name="video-camera" size={24} color="red" />
            <Text style={styles.optionText}>Video</Text>
          </TouchableOpacity>
        </View>

        {/* Display the selected image or video */}
        <View style={styles.mediaPreview}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}
          {selectedVideo && (
            <ExpoVideo
              source={{ uri: selectedVideo }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay
              isLooping
              style={styles.previewVideo}
            />
          )}
        </View>
      </ScrollView>

      {/* Post Button */}
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    flexGrow: 1,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  publicText: {
    color: 'gray',
    fontSize: 14,
  },
  textInput: {
    marginTop: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  optionText: {
    fontSize: 16,
  },
  mediaPreview: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  previewVideo: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  postButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 8,
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
