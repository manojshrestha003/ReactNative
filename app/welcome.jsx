import React from 'react'
import {View, Text, StatusBar, StyleSheet, Image} from 'react-native'
import ScreenWrapper from '../components/ScreenWrapper'
import { hp, wp } from '../helpers/common'
import Button from '../components/Button'
const welcome = () => {
  return (
    <ScreenWrapper bg = 'white'>
       <StatusBar style='dark'/>
       <View style= {styles.container}>
        {/*WELCOME IMAGE */}
        <Image style = {styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>
        <View style = {{gap:20}}>
          <Text style = {styles.title}>LinkUp!</Text>
          <Text style = {styles.punchLine}>Where every thought finds a home and every image tells a story </Text>

        </View>

       </View>
       <View>
        <Button/>
       </View>
    </ScreenWrapper>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor:'white',
    paddingHorizontal:wp(4)

  },
  welcomeImage:{
    height:hp(60),
    width:wp(100),
    alignSelf:'center'
  },
  title: {
    fontSize: hp(12),
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
   
  
 
  },
  punchLine: {
    fontSize: hp(4),
    color: '#555',
    textAlign: 'center',
    fontWeight: '400',
   
    paddingHorizontal: wp(3),
    
  },
    



})

export default welcome
