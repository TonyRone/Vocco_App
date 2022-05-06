import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";

import { SvgXml } from 'react-native-svg';
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import blankHeartSvg from '../../assets/post/blankHeart.svg';
import redHeartSvg from '../../assets/post/redHeart.svg';
import notifySvg from '../../assets/common/notify.svg';
import curveSvg from '../../assets/record/curve.svg';
import { styles } from '../style/Common';
import { CommenText } from "./CommenText";
import { createIconSetFromFontello } from "react-native-vector-icons";
import VoicePlayer from '../Home/VoicePlayer';
import { windowWidth } from "../../config/config";

export const AnswerSimpleItem = ({
  info,
  onPressPlay = () => {},
  onStopPlay = ()=>{},
  isPlaying = false,
}) => {
  return (
    <View
      style={{
        marginTop:0,
        flexDirection:'row',
      }}
    >
      <SvgXml
        xml={curveSvg}
      />
      <View
        style={[styles.rowSpaceBetween,{marginTop:32,width:'90%'}]}
      >
        <View style={styles.rowAlignItems}>
          <Image
            source={{uri:info.user.avatar.url}}
            style={{width:28,height:28,borderRadius:3,marginLeft:4,}}
            resizeMode='cover'
          />
          <View
            style={{
              backgroundColor:'#FFF',
              borderWidth:2,
              borderColor:'rgba(255, 255, 255, 0.6)',
              position:'absolute',
              borderRadius:50,
              justifyContent:'center',
              alignItems:'center',
              left:20,
              bottom:-5
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: 'white',
              }}
            >
              {/* {String.fromCodePoint(erngSvg)} */}
              {info.emoji ? info.emoji : "😁"}
            </Text>
          </View>
          <DescriptionText
            text = {info.user.name}
            fontSize = {15}
            lineHeight = {28}
            color = '#000000'
            marginLeft = {10}
          />
        </View>
        <VoicePlayer
          voiceUrl = {info.file.url}
          rPlayBtn = {true}
          premium = {info.user.premium!='none'}
          height = {22}
          tinWidth = {windowWidth/500}
          mrg = {windowWidth/1500}
          stopPlay ={()=>onStopPlay()}
          playing={isPlaying}
        />
     
      </View>
    </View>
  );
};
