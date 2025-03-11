import { StyleSheet, Text, View, Button, Alert, Pressable, Image, ScrollView, ActivityIndicator, Share, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/superbase';
import { useAuth } from '../../contexts/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { Video } from 'expo-av';
import { getUserData } from '../../services/userService';
const Home = () => {
  const videoRef = useRef(null);
  const { user, loading: authLoading } = useAuth(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getUser, setGetUser] = useState({});
  const [likes, setLikes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [post, setPost] = useState(null)
  const router = useRouter();

 
  useEffect(() => {
    if (!authLoading && user && user.id) {
      updateUserData(user.id);
      getPosts(); 
    }
  }, [user, authLoading]);

  
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:users (id, name, image)', 'postLikes(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fetch post error:', error);
      return { success: false, message: 'Could not fetch the posts' };
    }
  };

  const getPosts = async () => {
    setLoading(true);
    const res = await fetchPosts();
    console.log('got post data', res);

    if (res.success) {
      setPosts(res.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log("Post ids are: ", posts.map(post => post.id));
  }, [posts]);

  const updateUserData = async (userId) => {
    try {
      const res = await getUserData(userId);
      setGetUser(res);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const createPostLike = async (postLike) => {
    try {
      const { data, error } = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Post like error:', error);
      return { success: false, message: 'Could not like post' };
    }
  };

  const removePostLike = async (postId, userId) => {
    try {
      const { error } = await supabase
        .from('postLikes')
        .delete()
        .eq('userId', userId)
        .eq('postId', postId);

      if (error) throw error;
      return { success: true, message: 'Post like removed' };
    } catch (error) {
      console.error('Remove post like error:', error);
      return { success: false, message: 'Could not remove post like' };
    }
  };

  const onLike = async (postId) => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }

    try {
      const existingLike = likes.find((like) => like.postId === postId && like.userId === user.id);

      if (existingLike) {
        const res = await removePostLike(postId, user.id);
        if (res.success) {
          setLikes(likes.filter((like) => like.postId !== postId || like.userId !== user.id));
        } else {
          Alert.alert('Error', 'Could not remove like');
        }
      } else {
        const newLike = { userId: user.id, postId };
        const res = await createPostLike(newLike);
        if (res.success) {
          setLikes([...likes, res.data]);
        } else {
          Alert.alert('Error', 'Could not like post');
        }
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase.from('postLikes').select('*');
        if (error) throw error;
        setLikes(data);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };
    fetchLikes();
  }, []); 

  useEffect(() => {
    getPostDetails();
  }, [selectedPostId]); 
  
  const fetchPostDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:users (id, name, image)', 'postLikes(*)')
        .eq('id', selectedPostId)
        .single();
  
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fetch postDetails error:', error);
      return { success: false, message: 'Could not fetch the post' };
    }
  };
  
  const getPostDetails = async () => {
    const res = await fetchPostDetails(); 
    console.log('Post details are: ', res);
    
    if (res.success) {
      setPost(res.data);
    }
  };
  

  
  
  const onShare = async (post) => {
    try {
      const result = await Share.share({
        message: `${post.body}`,
      });
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };
  const openPostDetails = (postId) => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }
    
    setSelectedPostId(postId);
    setModalVisible(true);
  };
  
  
  

  if (authLoading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  if (!user) {
    return <Text>User not logged in</Text>;
  }

  
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.logo}>LinkUp</Text>
        <View style={styles.iconContainer}>
          <Pressable onPress={() => router.push('/notifications')} style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push('/newpost')} style={styles.iconButton}>
            <Ionicons name="add-circle-outline" size={22} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push('/profile')} style={styles.iconButton}>
            <Avatar uri={getUser?.data?.image || 'default_image_url'} />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
      </View>

      <ScrollView>
        {posts.map((post, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.userContainer}>
              <Avatar uri={post.user.image} style={styles.avatar} />
              <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <View>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(post.created_at).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color="black"  onPress={() => openPostDetails(post.id)}/>
              </View>
            </View>

            <Text style={styles.body}>{post.body}</Text>

            {post.file && post.file.endsWith('.mp4') ? (
              <Video
                ref={videoRef}
                source={{ uri: `https://alrzxgvbagnrdlkjtwxm.supabase.co/storage/v1/object/public/uploads/${post.file}` }}
                style={styles.postMedia}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    videoRef.current?.setPositionAsync(0);
                  }
                }}
              />
            ) : post.file ? (
              <Image
                source={{ uri: `https://alrzxgvbagnrdlkjtwxm.supabase.co/storage/v1/object/public/uploads/${post.file}` }}
                style={styles.postMedia}
              />
            ) : null}

            <View style={styles.actionIcons}>
              <Pressable style={styles.iconButton} onPress={() => onLike(post.id)}>
                <Ionicons
                  name={likes.some((like) => like.postId === post.id && like.userId === user.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={likes.some((like) => like.postId === post.id && like.userId === user.id) ? 'red' : 'black'}
                />
                <Text style={styles.likeCount}>{likes.filter((like) => like.postId === post.id).length}</Text>
              </Pressable>

              <Pressable style={styles.iconButton} onPress={() => openPostDetails(post.id)}>
                <Ionicons name="chatbubble-outline" size={24} color="black" />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={onShare}>
                <Ionicons name="share-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        ))}

        {loading && <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />}
      </ScrollView>

      {/* Modal for Comments */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Post ID: {selectedPostId}</Text>
            <Text>
             Hello
            </Text>
           
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};


export default Home;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'whitesmoke',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10,
  },
  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 5,
  },
  content: {
    marginTop: 20,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    top: -10,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  body: {
    marginVertical: 10,
    fontSize: 14,
  },
  postMedia: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 5,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  likeCount: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '95%', 
    height: '70%', 
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
});
