import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/authContext';
import { supabase } from '../lib/superbase';
import { getUserData } from '../services/userService';

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Session user:', session?.user?.id);

        if (session?.user) {
          setAuth(session.user);
          await updateUserData(session.user.id); // Pass user ID
          router.replace('/Home');
        } else {
          setAuth(null);
          router.replace('/welcome');
        }
      }
    );

    return () => authListener?.subscription.unsubscribe(); // Cleanup
  }, []);

  const updateUserData = async (userId) => {
    try {
      const res = await getUserData(userId);
      console.log('Got user data:', res);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
