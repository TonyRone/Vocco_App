import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";

import { useSelector } from 'react-redux';

import { HeartIcon } from './HeartIcon';
import { StoryLikes } from "./StoryLikes";
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { SvgXml } from 'react-native-svg';
import { FlatList, ScrollView} from 'react-native-gesture-handler';
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import whiteTrashSvg from '../../assets/notification/white_trash.svg'
import blankHeartSvg from '../../assets/post/blankHeart.svg';
import redHeartSvg from '../../assets/post/redHeart.svg';
import { styles } from '../style/Common';
import VoiceService from "../../services/VoiceService";
import VoicePlayer from "../Home/VoicePlayer";
import { windowWidth } from "../../config/config";
import { ReplyAnswerItem } from "./ReplyAnswerItem";

export const AnswerVoiceItem = ({
  info,
  props,
  onChangeIsLiked = ()=>{},
  onDeleteItem = ()=>{},
  holdToAnswer = ()=>{}
}) => {

  const {user} = useSelector((state)=> state.user);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyAnswers, setReplyAnswers] = useState([]);
  const [allLikes, setAllLikes] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const {t, i18n} = useTranslation();
  const [lastTap,setLastTap] = useState(0);
  let userImage = info.user.avatar.url,
      userName = info.user.name,
      heartNum = info.likesCount,
      check = info.isLiked;
  let num = Math.ceil((new Date().getTime()-new Date(info.createdAt).getTime())/60000),minute = num%60;
  num = (num-minute)/60;
  let hour = num%24,day = (num-hour)/24,time = day>0?(day.toString()+'d'):(hour>0?(hour.toString()+'h'):(minute>0?(minute.toString()+'m'):''));
  
  const DOUBLE_PRESS_DELAY = 400;


  const onLikeVoice = ()=>{
    let rep;
    if(info.isLiked==false)
      rep = VoiceService.answerAppreciate({id:info.id});
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

  const onExpand =()=>{
    if(isExpanded){
      setIsExpanded(false);
    }
    else{
      setIsExpanded(true);
      VoiceService.getReplyAnswerVoices(info.id).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setReplyAnswers([...jsonRes]);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  const setIsLiked= (index)=>{
    let tp = [...replyAnswers];
    tp[index].isLiked = !tp[index].isLiked;
    if(tp[index].isLiked) tp[index].likesCount ++;
    else tp[index].likesCount --;
    setReplyAnswers(tp);
  }

  const onDeleteAnswer=()=>{
    if(info.user.id == user.id){
      VoiceService.deleteAnswer(info.id);
      onDeleteItem();
    }
  }

  const onDeleteReplyAnswer=(index)=>{
    let tp = [...replyAnswers];
    tp.splice(index,1);
    setReplyAnswers(tp);
  }
  
  return (<>
    <ScrollView  horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{maxWidth:windowWidth,borderBottomColor:'#F2F0F5',borderBottomWidth:1}}>
      <TouchableOpacity
        style={{
          marginBottom:3,
          paddingHorizontal:30,
          paddingTop:10,
          width:windowWidth,
          paddingBottom:10,
          backgroundColor:'#FFF',
        }}
        onLongPress={()=>onExpand()}
        onPress={() => onClickDouble()}
      >
        <View
          style={[styles.rowSpaceBetween]}
        >
          <View style={styles.rowAlignItems}>
            <TouchableOpacity onPress={()=>info.user.id==user.id?props.navigation.navigate('Profile'):props.navigation.navigate('UserProfile',{userId:info.user.id})}>
              <Image
                style={{
                  width:40,
                  height:40,
                  marginBottom:15,
                  borderRadius:20,
                  borderColor:'#FFA002',
                  borderWidth:info.user.premium=='none'?0:2
                }}
                source={{uri:userImage}}
              />
            </TouchableOpacity>
            <View style={{marginLeft:16}}>
              <TitleText
                text={userName}
                fontSize={15}
                lineHeight={24}
              />
              <TouchableOpacity onPress={()=>setAllLikes(true)}>
                <DescriptionText
                  text={time+" • "+heartNum+' like'+(heartNum>1?'s':'')}
                  fontSize={12}
                  lineHeight={16}
                  marginTop={2}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setIsExpanded(false);holdToAnswer();}}>
                <DescriptionText
                  text= "Tap to answer"
                  color="#8327D8"
                  fontSize={12}
                  lineHeight={16}
                  marginTop={5}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rowAlignItems}>
            <HeartIcon
              isLike = {check}
              height = {windowWidth/25}
              marginRight={22}
              marginBottom={22}
              OnSetLike = {()=>onLikeVoice()}
            />
            <View style={{alignItems:'center'}}>
              <TouchableOpacity
                onPress={()=>setIsPlaying(!isPlaying)}
              >
                <SvgXml
                  width={40}
                  height={40}
                  xml={isPlaying ? pauseSvg : playSvg}
                />
              </TouchableOpacity>
              <DescriptionText
                text={new Date(info.duration * 1000).toISOString().substr(14, 5)}
                lineHeight={16}
                marginTop={6}
                fontSize={12}
              />
            </View>
          </View>
        </View>
        {
          isPlaying&&
          <View style={{marginTop:8,width:'100%'}}> 
            <VoicePlayer
              voiceUrl = {info.file.url}
              stopPlay ={()=>setIsPlaying(false)}
              premium = {info.user.premium!='none'}
              playBtn = {false}
              replayBtn = {false}
              playing={true}
              tinWidth={windowWidth/150}
              mrg={windowWidth/600}
              height={30}
            />
          </View>
        }
      </TouchableOpacity>
      {info.user.id == user.id&&
      <TouchableOpacity onPress={()=>onDeleteAnswer()} style={[styles.rowAlignItems,{
          width:windowWidth,
          paddingVertical:24,
          backgroundColor:'#E41717',
          borderTopLeftRadius:24,
          borderBottomLeftRadius:24
      }]}>
          <View style={{width:2,height:16,marginLeft:4,backgroundColor:'#B91313',borderRadius:1}}></View>
          <SvgXml
              marginLeft = {10}
              xml={whiteTrashSvg}
          />
          <DescriptionText
              text = {t("Delete")}
              fontSize = {17}
              lineHeight = {22}
              color = 'white'
              marginLeft= {16}
          />
      </TouchableOpacity>}
    </ScrollView>
    {allLikes&&
    <StoryLikes
      props={props}
      storyId={info.id}
      storyType="answer"
      onCloseModal={()=>setAllLikes(false)}
    />}
    {isExpanded&&replyAnswers.length>0&&
      <>
      <FlatList
      data={replyAnswers}
      renderItem={({item,index})=>
        (showMore==false&&index>1)?null:
        <ReplyAnswerItem
          key={index+item.id+'replyAnswerItem'}
          info = {item}
          onChangeIsLiked = {()=>setIsLiked(index)}
          onDeleteReplyItem={()=>onDeleteReplyAnswer(index)}
        />
      }
      keyExtractor={(item, index) => index.toString()}
      />
      {replyAnswers.length>2&&
        <TouchableOpacity onPress={()=>setShowMore(!showMore)}>
          <DescriptionText
            text={showMore?t("View less answers"):t("View more answers")}
            fontSize={13}
            color="#281E30"
            marginTop={6}
            marginBottom={12}
            marginLeft={82}
          />
        </TouchableOpacity>
      }
      </>
    }
  </>
  );
};
