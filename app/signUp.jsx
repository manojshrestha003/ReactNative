import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/superbase';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
  
    try {
      // Sign up the user in Supabase Authentication
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
  
      if (signUpError) {
        console.error("Sign Up Error:", signUpError);
        Alert.alert("Sign up failed", signUpError.message);
        return;
      }
  
      // Get the user ID from the session
      const userId = signUpData.user?.id;
  
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please try again.");
        return;
      }
  
      // Insert user data into the 'users' table
      const { error: insertError } = await supabase.from('users').insert([
        { id: userId, name }
      ]);
  
      if (insertError) {
        console.error("Database Insert Error:", insertError);
        Alert.alert("Database Error", "Failed to save user data.");
        return;
      }
  
      console.log("User added to database successfully!");
      Alert.alert("Success", "Account created successfully!");
      router.push('/login');
  
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  


  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20 }}>
      <Ionicons name="chevron-back" size={30} color="black" />
    </TouchableOpacity>
        <Text style= {styles.started}>Let's get started!</Text>
        <Text style={styles.title}>Please fill the details below to create an  account.</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={()=>{router.push('/login')}}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 20,
    backgroundColor:'whitesmoke',
    borderRadius:10
  },
  title: {
    fontSize: 13,
    fontWeight: 400,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
  },
  button: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  started:{
    fontSize:30,
    fontWeight:700,
    marginBottom:20,
    color:'green'
  }
});
