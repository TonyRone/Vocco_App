import React from "react";
import { View, Pressable, Image, Text, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

export const FriendItem = ({
  props,
  info,
  isUserName = false
}) => {

  let isGreen = false;
  if(isUserName == true && (info.isFriend == true||info.user.premium!='none'))
    isGreen = true;

  const {t, i18n} = useTranslation();

  const user = useSelector((state) => {
    return (
        state.user.user
    )
  });

  const onLimit = (v) => {
    return ((v).length > 8) ?
      (((v).substring(0, 5)) + '...') :
      v;
  }

  return (
    <TouchableOpacity
      style={{
        width:56,
        marginLeft:16,
      }}
      onPress = {()=>props.navigation.navigate('VoiceProfile', {id:info.id})}
    >
      <Image
        source={{uri:info.user.avatar?.url}}
        style={{width:isGreen?57:56,height:isGreen?57:56,borderRadius:isGreen?28.5:28,borderWidth:isGreen?1:0,borderColor:info.user.premium!='none'?'#FFA002':'#00FF00'}}
        resizeMode='cover'
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize:11,
          fontFamily:"SFProDisplay-Regular",
          letterSpacing:0.066,
          color: 'rgba(54, 36, 68, 0.8)',
          textAlign:"center",
          marginTop:4
        }}
      >
        {isUserName?onLimit(info.user.name):onLimit(info.title)}
      </Text>
    </TouchableOpacity>
  );
};
