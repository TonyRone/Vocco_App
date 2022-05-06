import React from "react";
import { View, Pressable, Image, Text, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

export const FriendItem = ({
  props,
  info,
}) => {

  const {t, i18n} = useTranslation();

  const user = useSelector((state) => {
    return (
        state.user.user
    )
  });
  return (
    <TouchableOpacity
      style={{
        width:56,
        marginRight:16,
        marginBottom: 16
      }}
      onPress = {()=>props.navigation.navigate('VoiceProfile', {info:info})}
    >
      <Image
        source={{uri:info.user.avatar.url}}
        style={{width:56,height:56,borderRadius:28}}
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
          marginTop:8
        }}
      >
        {info.user.id==user.id?t("You"):info.user.name}
      </Text>
    </TouchableOpacity>
  );
};
