import React from 'react';
import { View, Text, StatusBar, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';
import Button from '../components/Button';

const Welcome = () => {
  const router = useRouter(); 

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* WELCOME IMAGE */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require('../assets/images/welcome.png')}
        />
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp!</Text>
          <Text style={styles.punchLine}>
            Where every thought finds a home and every image tells a story
          </Text>
        </View>
      </View>

      <View>
        {/* Getting Started Button */}
        <Button title="Getting Started" onPress={() => router.push('/signUp')} />

        {/* Bottom Text for Login */}
        <View style={styles.bottomTextContainer}>
          <Text style={styles.login}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.loginText}> Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center',
  },
  title: {
    fontSize: hp(6),
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
  },
  punchLine: {
    fontSize: hp(2),
    color: '#555',
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: wp(3),
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  login: {
    fontSize: 16,
    color: '#555',
  },
  loginText: {
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 5, 
  },
});

export default Welcome;
