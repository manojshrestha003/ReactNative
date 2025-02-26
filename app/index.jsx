import React from 'react'
import {Text,Button, View} from 'react-native'
import {useRouter} from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper';

const index = () => {
    const router = useRouter();
  return (
    <ScreenWrapper>
        <View>
            <Text>Hello Nepal</Text>
            <Button title='Welcome' onPress={()=>{router.push('/welcome')}}/>
        </View>

        </ScreenWrapper>
        
      
    
  )
}

export default index
