import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Image,
  Pressable,
} from "react-native";

import {useTranslation} from 'react-i18next';
import EmojiPicker from 'rn-emoji-keyboard';
import '../../language/i18n';
import { PostContext } from '../component/PostContext';
import { TitleText } from "./TitleText";
import { HeartIcon } from './HeartIcon';
import { StoryLikes } from './StoryLikes';
import { DescriptionText } from "./DescriptionText";
import { AnswerSimpleItem } from './AnswerSimpleItem';
import { useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import notifySvg from '../../assets/common/notify.svg';
import yellow_starSvg from '../../assets/common/yellow_star.svg';

import { styles } from '../style/Common';
import VoiceService from '../../services/VoiceService';
import VoicePlayer from '../Home/VoicePlayer';
import { windowWidth } from '../../config/config';

export const VoiceItem = ({
  props,
  info,
  isRefresh = false,
  onChangeLike = () => {},
  spread = true,
}) => {
  const [answerVoices,setAnswerVoices] = useState([]);
  const [received,setReceived] = useState(false);
  const [showAnswers,setShowAnswers] = useState(false);
  const [showEmojies,setShowEmojies] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [nowVoice, setNowVoice] = useState(null);
  const [lastTap,setLastTap] = useState(0);
  const [delayTime,setDelayTime] = useState(null);  const {t, i18n} = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [allLikes, setAllLikes] = useState(false);
  
  let { user } = useSelector((state) => {
    return (
        state.user
    )
  });

  const DOUBLE_PRESS_DELAY = 400;
 
  let userImage = info.user.avatar.url,
      voiceTitle = info.title,
      details = info.user.name,
      voiceTime = info.duration ,
      erngSvg = info.emoji ? info.emoji : "😁",
      comments= info.answersCount,
      premium = info.user.premium;

      let num = Math.ceil((new Date().getTime()-new Date(info.createdAt).getTime())/60000);
      let minute = num%60;
      num = (num-minute)/60;
      let hour = num%24;
      let day = (num-hour)/24
      let time = (day>0?(day.toString()+' '+t("day")+(day>1?'s':'')):(hour>0?(hour.toString()+' '+t("hour")+(hour>1?'s':'')):(minute>0?(minute.toString()+' '+t("minute")+(minute>1?'s':'')):'')));

  const [reactions,setReactions] = useState(info.reactions);
  const [reactionsCount,setReactionsCount] = useState(info.reactionsCount);

  if(isRefresh != refresh){
    setRefresh(isRefresh);
    setShowEmojies(false);
  }

  const onShowAnswers = ()=>{
    if(received==false&&spread){
      VoiceService.getAnswerVoices(info.id).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setAnswerVoices(jsonRes);
          setReceived(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    setShowAnswers(!showAnswers);
  }

  const OnSetLike =()=>{
    if(info.isLike == true){
      VoiceService.recordUnAppreciate(info.id);
    }
    else{
      VoiceService.recordAppreciate({count:1,id:info.id});
    }
    onChangeLike(!info.isLike);
  }

  const selectIcon = (icon)=>{
    setShowEmojies(false);
    VoiceService.addReaction({id:info.id,emoji:icon}).then(async res=>{
      const jsonRes = await res.json();
      if(res.respInfo.status==201){
        setReactions(jsonRes.lastreactions);
        setReactionsCount(jsonRes.reactioncount);
      }
    })
    .catch(err=>{
      console.log(err)
    })
    let i, temp = reactions;
    if(temp.length==0)
      temp = [];
    for( i=0 ; i < reactions.length; i++ ){
      if(reactions[i].user.id == user.id){
        temp[i].emoji = icon;
        break;
      }
    }
    if(i==temp.length){
      for(i=2; i>0; i--) {
        if(i>reactions.length) continue;
        temp[i]=temp[i-1];
      }
      if(temp.length==0){
        temp.push({emoji:icon,user:{id:user.id}});
      }
      else temp[0]={emoji:icon,user:{id:user.id}};
      if(reactions.length<3)
        setReactionsCount(reactionsCount+1);
      setReactions(temp);
    }
    else
      setReactions(temp);
  }
  const onStopAnswerPlay = () => {
    setNowVoice(null);
  };

  const onClickDouble = () => {
    const timeNow = Date.now();
    var timeout;
    clearTimeout(timeout);
    if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(delayTime);
      OnSetLike();
    } else {
      setLastTap(timeNow);
      setDelayTime(setTimeout(() => {
      //  if(voiceState==false){
          props.navigation.navigate('VoiceProfile', {id:info.id});
       // }
      }, DOUBLE_PRESS_DELAY));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          marginTop:12,
          marginBottom:4,
          paddingHorizontal:16,
          marginHorizontal:16,
          paddingTop:16,
          paddingBottom:12,
          backgroundColor:'#FFF',
          shadowColor: 'rgba(88, 74, 117, 1)',
          elevation:10,
          shadowOffset:{width: 0, height: 2},
          shadowOpacity:0.5,
          shadowRadius:8,
          borderRadius:16,
          borderWidth:premium=='none'?0:1,
          borderColor:'#FFA002',
          zIndex:0
        }}
        onLongPress={()=>setShowContext(true)}
        onPress={()=>onClickDouble()}
      >
        <View
          style={[styles.rowSpaceBetween]}
        >
          <View
            style={styles.row}
          >
            <View>
              <Image
                source={{uri:userImage}}
                style={{width:50,height:50,borderRadius:25,borderColor:'#FFA002',borderWidth:premium=='none'?0:2}}
                resizeMode='cover'
              />
              <View
                style={{
                  backgroundColor:'#FFF',
                  borderWidth:3,
                  borderColor:'rgba(255, 255, 255, 0.6)',
                  position:'absolute',
                  borderRadius:50,
                  justifyContent:'center',
                  alignItems:'center',
                  right:-10,
                  bottom:-2
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                  }}
                >
                  {/* {String.fromCodePoint(erngSvg)} */}
                  {erngSvg}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft:20
              }}
            >
              <TitleText
                text={voiceTitle}
                maxWidth = {windowWidth-180}
                fontSize={17}
              />
              <View style={styles.rowAlignItems}>
                {premium!='none'&&
                <SvgXml
                  width={30}
                  height={30}
                  xml={yellow_starSvg}
                />}
                <DescriptionText
                  text={details + ' • ' + new Date(voiceTime * 1000).toISOString().substr(14, 5)}
                  lineHeight={30}
                  fontSize={13}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={()=>setIsPlaying(!isPlaying)}
          >
            <SvgXml
              width={45}
              height={45}
              xml={isPlaying ? pauseSvg : playSvg}
            />
          </TouchableOpacity>
        </View>
        {
          isPlaying&&
          <View style={{marginTop:15,width:'100%'}}> 
            <VoicePlayer
              voiceUrl = {info.file.url}
              stopPlay ={()=>setIsPlaying(false)}
              playBtn = {false}
              replayBtn = {false}
              premium = {premium!='none'}
              playing={true}
              tinWidth={windowWidth/150}
              mrg={windowWidth/600}
            />
          </View>
        }
        
        <View
          style={[styles.rowSpaceBetween,{marginTop:8}]}
        >
          <View style={[styles.row, {alignItems:'center'}]}>
            <HeartIcon
              isLike = {info.isLike}
              OnSetLike = {()=>OnSetLike()}
              marginLeft={6}
              marginRight={7}
            />
            <TouchableOpacity onPress={()=>setAllLikes(true)}>
              <DescriptionText
                text={info.likesCount}
                fontSize={17}
                lineHeight={19}
                fontFamily="SFProDisplay-Medium"
                color="rgba(59, 31, 82, 0.6)"
              />
            </TouchableOpacity>
            <DescriptionText
              text = {time}
              fontSize = {13}
              lineHeight = {15}
              marginLeft = {30}
              color = 'rgba(54, 36, 68, 0.8)'
            />
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {/* <Text
              style={{
                fontFamily:"SFProDisplay-Regular",
                fontSize:12,
                color:'#8327D8'
              }}
            >
              {t("Tap here to answer")}
            </Text> */}
            <SvgXml
              width={19}
              height={19}
              xml={notifySvg}
            />
            <DescriptionText
              text={comments}
              fontSize={16}
              lineHeight={19}
              fontFamily="SFProDisplay-Medium"
              color="rgba(59, 31, 82, 0.6)"
              marginLeft={12}
              marginRight={4}
            />
          </View>
        </View>
      </TouchableOpacity>
      {showContext&&
        <PostContext
          postInfo = {info}
          props = {props}
          onChangeIsLike = {()=>OnSetLike()}
          onCloseModal = {()=>setShowContext(false)}
        />
      }
     {allLikes&&
      <StoryLikes
        props={props}
        storyId={info.id}
        storyType="record"
        onCloseModal={()=>setAllLikes(false)}
      />}
    </>
  );
};
