import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

const Profile = () => {
  return (
    <View className='bg-primary flex-1 px-10' >
      <View className='flex flex-col gap-5 flex-1 justify-center items-center'>
        <Image source={icons.person} className='size-10' tintColor={'#fff'} />
        <Text className='text-gray-500 text-base '>Profile</Text>
      </View>
    </View>
  )
}

export default Profile