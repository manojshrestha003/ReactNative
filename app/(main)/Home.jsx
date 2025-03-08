import { StyleSheet, Text, View, Button, Alert, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState,useRef } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/superbase';
import { useAuth } from '../../contexts/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { Video } from 'expo-av';
import { getUserData } from '../../services/userService';

const Home = () => {
  const videoRef = useRef(null)
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getUser, setGetUser] = useState({})
  const router = useRouter();

  useEffect(() => {
    getPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:users (id, name, image)')
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
    console.log("got post data", res);
    if (res.success) {
      setPosts(res.data);
    }
    setLoading(false); 
  };
const updateUserData = async (userId) => {
      try {
        const res = await getUserData(userId);
        setGetUser(res)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    useEffect(()=>{
      updateUserData(user.id); 
    },[])
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
             <Avatar uri={getUser?.data?.image} />
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
                <Ionicons name="ellipsis-vertical" size={20} color="black" />
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
              <Pressable style={styles.iconButton}>
                <Ionicons name="heart-outline" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="chatbubble-outline" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="share-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        ))}

       
        {loading && <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />}
      </ScrollView>
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
    alignSelf: 'center', 
  },
});
