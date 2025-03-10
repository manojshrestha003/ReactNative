import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const PostDetails = () => {
  const { postId } = useLocalSearchParams(); // Extract postId from query params
  const [loading, setLoading] = useState(true);
  const [postDetails, setPostDetails] = useState(null);

  useEffect(() => {
    if (postId) {
      console.log("Post ID: ", postId); // Check the console if postId is received
      fetchPostDetails(postId);  // Fetch post details if postId is present
    }
  }, [postId]);

  const fetchPostDetails = async (postId) => {
    try {
      // Fetch post data from Supabase or API based on postId
      // For example, you can use supabase to fetch post details.
      const post = await fetchPostFromDatabase(postId);
      setPostDetails(post);
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!postDetails) {
    return <Text>Post not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Details for Post ID: {postId}</Text>
      <Text style={styles.body}>{postDetails.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default PostDetails;
