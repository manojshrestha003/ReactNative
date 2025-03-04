import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Header } from '@rneui/themed/dist/Header'
import { ScrollView } from 'react-native-web'
import Avatar from '../../components/Avatar'

 
const newpost = () => {
  return (
    <View>
      <View style = {styles.container}>
      <Header title = "Create Post "/>
      <ScrollView >
        {/*Avatar */}
        <View style = {styles.avatar}>
          <Avatar
          uri={user?.image}/>
        


        </View>
        <View style= {{gap:2}}>
          {
            user && user?.data?.name
          }

        </View>
        

      </ScrollView>

      </View>
      
    </View>
  )
}

export default newpost

const styles = StyleSheet.create({})