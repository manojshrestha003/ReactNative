import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../contexts/authContext';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { getUserData } from '../../services/userService';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/superbase';
import { uploadFile } from '../../services/imageService';
import { Video as ExpoVideo } from 'expo-av';

import { useRouter } from 'expo-router';

const NewPost = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [getUser, setGetUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State for activity indicator

  useEffect(() => {
    if (user?.id) {
      updateUserData(user.id);
    }
  }, []);

  const updateUserData = async (userId) => {
    try {
      const res = await getUserData(userId);
      setGetUser(res);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedVideo(result.assets[0].uri);
        setSelectedImage(null);
      }
    }
  };

  // Function to upload post
  const createOrUpdatePost = async () => {
    try {
      let fileUrl = null;
      let fileType = null;

   
      if (selectedImage) {
        fileType = "image";
        console.log("Uploading image:", selectedImage);
        let uploadResult = await uploadFile("postImages", selectedImage, true);
        console.log("Upload Result:", uploadResult);

        if (uploadResult.success) {
          fileUrl = uploadResult.data;
        } else {
          alert("Could not upload image");
          return { success: false, message: "Could not upload image" };
        }
      } else if (selectedVideo) {
        fileType = "video";
        console.log("Uploading video:", selectedVideo);
        let uploadResult = await uploadFile("postVideos", selectedVideo, false);
        console.log("Upload Result:", uploadResult);

        if (uploadResult.success) {
          fileUrl = uploadResult.data;
        } else {
          alert("Could not upload video");
          return { success: false, message: "Could not upload video" };
        }
      }

      
      const post = {
        userId: user.id,
        body: caption,
        file: fileUrl,
        created_at: new Date(),
      };

      console.log("Uploading post to database:", post);

      const { data, error } = await supabase.from("posts").insert(post).select().single();
      
      if (error) {
        console.error("Create post Error:", error.message);
        return { success: false, message: error.message };
      }

      console.log("Post successfully created:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Create post Error:", error);
      return { success: false, message: "Could not create post" };
    }
  };


  const onSubmit = async () => {
    setIsUploading(true); 
    const result = await createOrUpdatePost();
    setIsUploading(false); 

    if (result.success) {
      alert("Post uploaded successfully!");
      setCaption("");
      setSelectedImage(null);
      setSelectedVideo(null);
      router.push('/Home')
    } else {
      alert(result.message);
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
          value={caption}
          onChangeText={setCaption}
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
      <TouchableOpacity style={styles.postButton} onPress={onSubmit}>
        {isUploading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.postButtonText}>Post</Text>
        )}
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
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

