import { StyleSheet, Text, View, FlatList , TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import Header from '../../components/Header';
import { supabase } from '../../lib/superbase';
import Avatar from '../../components/Avatar';
import { useRouter } from 'expo-router';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  const fetchNotifications = async (receiverId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:senderId(id, name, image)')
        .eq('receiverId', receiverId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Notifications:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Fetch notification error:', error);
      return { success: false, message: 'Could not fetch notifications' };
    }
  };

  const getNotifications = async () => {
    if (!user?.id) return;
    const res = await fetchNotifications(user.id);
    console.log('Notifications:', res);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user?.id]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('postId',item.postId)
        if (item.postId) {
          router.push(`/post/${item.postId}`);
        } else {
          console.warn('No postId found for this notification');
        }
      }}
    >
      <View style={styles.notificationItem}>
        {/* Sender's Profile Image */}
        <Avatar 
          uri={item.sender?.image || 'https://via.placeholder.com/50'} 
          style={styles.avatar} 
        />
        {/* Notification Text */}
        <View style={styles.notificationText}>
          <Text style={styles.senderName}>
            {item.sender?.name || 'Unknown'}
          </Text>
          <Text style={styles.message}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Header title="Notifications" />
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications</Text>}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10, 
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2, 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20, 
  },
  notificationText: {
    flex: 1,
    gap: 4, 
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
