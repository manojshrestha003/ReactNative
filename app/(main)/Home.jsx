import { StyleSheet, Text, View, Button, Alert, Pressable } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/superbase';
import { useAuth } from '../../contexts/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';

const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Log Out', `Error signing out: ${error.message}`);
    }
  };

  return (
    <ScreenWrapper>
      {/* Fixed Header */}
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
           <Avatar   uri={user?.image}
            
           />
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <Button title="Logout" onPress={logOut} />
      </View>
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
    marginTop: 70, 
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
