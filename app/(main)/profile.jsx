import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  Pressable 
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/authContext';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { supabase } from '../../lib/superbase';
import Avatar from '../../components/Avatar';
import { getUserData } from '../../services/userService';

const Profile = () => {
  const { user, setAuth } = useAuth(); 
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Log Out', `Error signing out: ${error.message}`);
    } else {
      setAuth(null);
      router.replace('/login');
    }
  };

  return (
    <ScreenWrapper>
      <UserHeader user={user} router={router} onLogout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, onLogout }) => {
  const [getUser, setGetUser] = useState({})

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
    <View style={styles.container}>
      {/* Header with Logout Button */}
      <Header
        title="Profile"
        showBackButton={true}
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        }
        
      />

      {/* Profile Avatar and Edit Icon */}
      <View style={styles.avatarContainer}>
        <Avatar uri={getUser?.data?.image} />
        <Pressable style={styles.editIcon}>
          <Ionicons name="create-outline" size={20} color="white"  onPress={()=>{router.push('/editProfile')}}/>
        </Pressable>
      </View>

      {/* User Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Ionicons name="person-outline" size={18} color="black" /> 
          Username: {getUser?.data?.name || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Ionicons name="location-outline" size={18} color="black" /> 
          Address: {getUser?.data?.address || 'N/A'}
        </Text>
      </View>

      {/* Contact Information */}
      <View style={styles.contactContainer}>
        <View style={styles.contactRow}>
          <MaterialIcons name="email" size={20} color="#007bff" />
          <Text style={styles.contactText}>Email: {user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={20} color="#007bff" />
          <Text style={styles.contactText}>Phone: {getUser?.data?.phoneNumber || 'N/A'}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="information-circle-outline" size={20} color="#007bff" />
          <Text style={styles.contactText}>Bio: {getUser?.data?.bio || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
    
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 5,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  contactContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
