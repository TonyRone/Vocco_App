import React, {useState} from "react";
import { View, TouchableOpacity, Text, Platform, StatusBar , Vibration } from "react-native";
import { NavigationActions, StackActions } from 'react-navigation';
import { SvgXml } from 'react-native-svg';
//Bottom Icons
import homeSvg from '../../assets/common/bottomIcons/home.svg';
import homeActiveSvg from '../../assets/common/bottomIcons/homeActive.svg';
import globalSvg from '../../assets/common/bottomIcons/global.svg';
import globalActiveSvg from '../../assets/common/bottomIcons/globalActive.svg';
import recordSvg from '../../assets/common/bottomIcons/record.svg';
import profileSvg from '../../assets/common/bottomIcons/profile.svg';
import profileActiveSvg from '../../assets/common/bottomIcons/profileActive.svg';
import settingSvg from '../../assets/common/bottomIcons/settings.svg';
import settingsActiveSvg from '../../assets/common/bottomIcons/settingsActive.svg';
import { baseProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlers";


export const BottomButtons = ({
  active = 'home',
  props,
}) => {

  const onNavigate = (des, par = null) =>{
    //props.navigation.navigate(navigateScreen,{info:jsonRes})
    const resetActionTrue = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: des, params:par })],
    });
    props.navigation.dispatch(resetActionTrue);
  }

  return (
    <View
      style={{
        position:'absolute',
        bottom:0,
        width:'100%',
        paddingHorizontal:27,
        paddingBottom:10,
        height:75,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        shadowColor: 'rgba(0, 0, 0, 1)',
        elevation:10,
        shadowOffset:{width: 0, height: 2},
        shadowOpacity:0.5,
        shadowRadius:8,
        backgroundColor:'#FFFFFF'
      }}
    >
      <TouchableOpacity
        onPress={()=>onNavigate('Feed')}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'home' ? homeActiveSvg : homeSvg}
        />
      </TouchableOpacity>          
      <TouchableOpacity
        onPress={()=>onNavigate('Discover')}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'global' ? globalActiveSvg : globalSvg}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=>{Vibration.vibrate(100);props.navigation.navigate("HoldRecord");}}
      >
        
          <SvgXml
            width={54}
            height={54}
            xml={recordSvg}
          />

        
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=>props.navigation.navigate("Profile")}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'profile' ? profileActiveSvg : profileSvg}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=>props.navigation.navigate("Setting")}
      >
        <SvgXml
          width={30}
          height={30}
          xml={active == 'settings' ? settingsActiveSvg : settingSvg}
        />
      </TouchableOpacity>
    </View>
  );
};
