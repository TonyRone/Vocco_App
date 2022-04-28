import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Image,
  Pressable,
} from "react-native";

import EmojiBoard from 'react-native-emoji-board'
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";
import { AnswerSimpleItem } from './AnswerSimpleItem';
import { ReactionEmojies } from './ReactionEmojies';
import { FlatList} from 'react-native-gesture-handler';
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
  isPlaying = false,
  onPressPostContext = () => {},
  onPressPlay = () => {},
  onStopPlay = ()=>{},
  spread = true,
}) => {
  const [answerVoices,setAnswerVoices] = useState([]);
  const [received,setReceived] = useState(false);
  const [showAnswers,setShowAnswers] = useState(false);
  const [showEmojies,setShowEmojies] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [nowVoice, setNowVoice] = useState(null);
  const [lastTap,setLastTap] = useState(0);
  const [delayTime,setDelayTime] = useState(null);
  const {t, i18n} = useTranslation();
  
  let { user, voiceState } = useSelector((state) => {
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

  const pressPlayVoice = (index)=>{
    if(nowVoice!=null){
      onStopAnswerPlay();
    }
    if(nowVoice!=index){
      setTimeout(() => {
        setNowVoice(index);
      }, nowVoice?400:0);
    }
  }
  const onClickDouble = () => {
    const timeNow = Date.now();
    var timeout;
    clearTimeout(timeout);
    if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(delayTime);
      onShowAnswers();
    } else {
      setLastTap(timeNow);
      setDelayTime(setTimeout(() => {
        if(voiceState==false){
          props.navigation.navigate('VoiceProfile', {info:info});
        }
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
        onLongPress={()=>{if(voiceState==false)return onPressPostContext()}}
        onPress={()=>{if(voiceState==false)return onClickDouble()}}
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
                style={{width:40,height:40,borderRadius:12,borderColor:'#FFA002',borderWidth:premium=='none'?0:2}}
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
                  right:-12,
                  bottom:5
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
            onPress={()=>onPressPlay()}
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
              stopPlay ={()=>onStopPlay()}
              playBtn = {false}
              replayBtn = {false}
              playing={true}
              tinWidth={windowWidth/150}
              mrg={windowWidth/600}
            />
          </View>
        }
        
        <View
          style={[styles.rowSpaceBetween, styles.mt16]}
        >
          <Pressable onPress={()=>setShowEmojies(true)} style={[styles.row, {alignItems:'center'}]}>
            {reactionsCount>0?
              reactions?.map((eLikes, index) => {
                return (
                  <Text
                    key={index+info.id+'reactions'}
                    style={{
                      fontSize: 12,
                      color: 'white',
                    }}
                  >
                    {/* {String.fromCodePoint(erngSvg)} */}
                    {eLikes.emoji}
                  </Text>
                )
              })
            :
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                opacity:0.5
              }}
            >
              {/* {String.fromCodePoint(erngSvg)} */}
              {"😂"}
            </Text>
            }
            <DescriptionText
              text={reactionsCount}
              fontSize={12}
              fontFamily="SFProDisplay-Medium"
              color="rgba(59, 31, 82, 0.6)"
              marginLeft={10}
            />
            <SvgXml
              width={12}
              height={12}
              xml={notifySvg}
              style={{marginLeft:30}}
            />
            <DescriptionText
              text={comments}
              fontSize={12}
              fontFamily="SFProDisplay-Medium"
              color="rgba(59, 31, 82, 0.6)"
              marginLeft={10}
            />
          </Pressable>
          <View>
            <Text
              style={{
                fontFamily:"SFProDisplay-Regular",
                fontSize:12,
                color:'#8327D8'
              }}
            >
              {t("Tap&Hold to answer")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {showAnswers&&answerVoices.length>0&&<FlatList
        style={{marginTop:5, marginLeft:15}}
        data={answerVoices}
        renderItem={({item,index})=>index<5?
          <AnswerSimpleItem
            key={index+info.id+'simpleItem'}
            info = {item}
            isPlaying = {index==nowVoice}
            onPressPlay={() => pressPlayVoice(index)}
            onStopPlay={()=>onStopAnswerPlay()}
          />:
          null
        }
        keyExtractor={(item, index) => index.toString()}
      />}
      {showEmojies&&
        <ReactionEmojies
          onSelectIcon={(icon)=>selectIcon(icon)}
          onCloseModal = {()=>setShowEmojies(false)}
        />
        // <EmojiBoard showBoard={showEmojies} onClick={selectIcon} />
      }
    </>
  );
};
