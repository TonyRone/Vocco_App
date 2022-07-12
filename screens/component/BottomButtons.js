import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Vibration, Image } from "react-native";
import { NavigationActions, StackActions } from 'react-navigation';
import { SvgXml } from 'react-native-svg';
//Bottom Icons
import homeSvg from '../../assets/common/bottomIcons/home.svg';
import homeActiveSvg from '../../assets/common/bottomIcons/homeActive.svg';
import chatSvg from '../../assets/common/bottomIcons/chat.svg';
import chatActiveSvg from '../../assets/common/bottomIcons/chatActive.svg';
import friendSvg from '../../assets/common/bottomIcons/friend.svg';
import friendActiveSvg from '../../assets/common/bottomIcons/friendActive.svg';
import { useSelector } from "react-redux";
import { Avatars } from "../../config/config";

export const BottomButtons = ({
  active = 'home',
  props,
}) => {

  let { user } = useSelector((state) => {
    return (
      state.user
    )
  });

  const onNavigate = (des, par = null) => {
    const resetActionTrue = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: des, params: par })],
    });
    props.navigation.dispatch(resetActionTrue);
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 27,
        paddingBottom: 10,
        height: 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 1)',
        elevation: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        backgroundColor: '#FFFFFF'
      }}
    >
      <TouchableOpacity
        onPress={() => onNavigate('Home')}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'home' ? homeActiveSvg : homeSvg}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onNavigate('Friends')}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'friends' ? friendActiveSvg : friendSvg}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => { Vibration.vibrate(100); props.navigation.navigate("HoldRecord"); }}
        style={{ width: 54, height: 54 }}
      >
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Chat")}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'chat' ? chatActiveSvg : chatSvg}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Profile")}
      >
        <Image
          source={user.avatar?{ uri: user.avatar.url }:Avatars[user.avatarNumber].uri}
          style={{ width: 30, height: 30, borderRadius: 15 }}
          resizeMode='cover'
        />
      </TouchableOpacity>
    </View>
  );
};
