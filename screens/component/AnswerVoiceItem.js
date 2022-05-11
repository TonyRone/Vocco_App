import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";

import { useSelector } from 'react-redux';

import { HeartIcon } from './HeartIcon';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { SvgXml } from 'react-native-svg';
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import blankHeartSvg from '../../assets/post/blankHeart.svg';
import redHeartSvg from '../../assets/post/redHeart.svg';
import { styles } from '../style/Common';
import VoiceService from "../../services/VoiceService";
import VoicePlayer from "../Home/VoicePlayer";
import { windowWidth } from "../../config/config";

export const AnswerVoiceItem = ({
  info,
  props,
  //isPlaying,
  //onStopPlay=()=>{},
  onChangeIsLiked = ()=>{},
  //onPressPlay = () => {},
}) => {

  const {user, voiceState} = useSelector((state)=> state.user);

  const [isPlaying, setIsPlaying] = useState(false);

  const {t, i18n} = useTranslation();
  const [lastTap,setLastTap] = useState(0);
  let userImage = info.user.avatar.url,
      userName = info.user.name,
      heartNum = info.likesCount,
      check = info.isLiked;
  let num = Math.ceil((new Date().getTime()-new Date(info.createdAt).getTime())/60000),minute = num%60;
  num = (num-minute)/60;
  let hour = num%24,day = (num-hour)/24,time = day>0?(day.toString()+' '+t("days")+' '+t("ago")):'';
  
  const DOUBLE_PRESS_DELAY = 400;


  const onLikeVoice = ()=>{
    let rep;
    if(info.isLiked==false)
      rep = VoiceService.answerAppreciate({count:1,id:info.id});
    else
      rep = VoiceService.answerUnAppreciate(info.id);
    rep.then(async res=>{
  //    if(res.respInfo.status==201||res.respInfo.status==200)
        
    })
    .catch(err=>{
      console.log(err);
    });
    onChangeIsLiked();
  }

  const onClickDouble = () => {
    const timeNow = Date.now();
    if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
      onLikeVoice();
    } else {
      setLastTap(timeNow);
      const timeout = setTimeout(() => {
        setLastTap(0);
      }, DOUBLE_PRESS_DELAY);
    }
  };
  
  return (
    <TouchableOpacity
      style={{
        marginTop:12,
        marginBottom:4,
        paddingHorizontal:14,
        marginHorizontal:16,
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:'#FFF',
        shadowColor: 'rgba(88, 74, 117, 1)',
        elevation:10,
        shadowOffset:{width: 0, height: 2},
        shadowOpacity:0.5,
        shadowRadius:8,
        borderRadius:16,
      }}
      onLongPress={()=>info.user.id==user.id?props.navigation.navigate('Profile'):props.navigation.navigate('UserProfile',{userId:info.user.id})}
      onPress={() => onClickDouble()}
    >
      <View
        style={[styles.rowSpaceBetween]}
      >
        <View style={styles.rowAlignItems}>
          <TouchableOpacity
            onPress={()=>setIsPlaying(!isPlaying)}
          >
            <SvgXml
              width={windowWidth/8}
              height={windowWidth/8}
              xml={isPlaying ? pauseSvg : playSvg}
            />
          </TouchableOpacity>
          <View
            style={styles.row}
          >
          <View style={{marginLeft:14}}>
            <View style={styles.rowAlignItems}>
              <TouchableOpacity onPress={()=>info.user.id==user.id?props.navigation.navigate('Profile'):props.navigation.navigate('UserProfile',{userId:info.user.id})}>
                <Image
                  style={{
                    width:35,
                    height:35,
                    borderRadius:12
                  }}
                  source={{uri:userImage}}
                />
                {/* <View
                  style={{
                    backgroundColor:'#FFF',
                    borderWidth:2,
                    borderColor:'rgba(255, 255, 255, 0.6)',
                    position:'absolute',
                    borderRadius:50,
                    justifyContent:'center',
                    alignItems:'center',
                    left:19,
                    bottom:-3
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: 'white',
                    }}
                  >
                    {info.emoji ? info.emoji : "😁"}
                  </Text>
                </View> */}
              </TouchableOpacity>
              <TitleText
                text={userName}
                fontSize={15}
                lineHeight={24}
                marginLeft={12}
              />
            </View>
            {time!=''&&
              <DescriptionText
                text={time}
                fontSize={13}
                lineHeight={16}
                marginTop={8}
              />
            }
          </View>
        </View>
          
        </View>
        <View style={styles.rowAlignItems}>
          <DescriptionText
            text = {heartNum}
            color = 'rgba(54, 36, 68, 0.8)'
            fontSize={20}
            marginRight = {8}
          />
          <HeartIcon
            isLike = {check}
            height = {windowWidth/17}
            OnSetLike = {()=>onLikeVoice()}
          />
        </View>
      </View>
      {
        isPlaying&&
        <View style={{marginTop:15,width:'100%'}}> 
          <VoicePlayer
            voiceUrl = {info.file.url}
            stopPlay ={()=>setIsPlaying(false)}
            premium = {info.user.premium!='none'}
            playBtn = {false}
            replayBtn = {false}
            playing={true}
            tinWidth={windowWidth/250}
            mrg={windowWidth/500}
          />
        </View>
      }
    </TouchableOpacity>
  );
};
