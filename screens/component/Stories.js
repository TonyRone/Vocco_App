import React, { useState, useEffect, useRef, useMemo} from 'react';
import { 
  View, 
  ScrollView,
  Image,
  Platform,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import * as Progress from "react-native-progress";
import { VoiceItem } from '../component/VoiceItem';
import { SvgXml } from 'react-native-svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import { windowHeight, windowWidth } from '../../config/config';
import { useSelector } from 'react-redux';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from '../component/DescriptionText';

export const Stories = ({
  props,
  loadKey = 0,
  screenName = '',
  category = '',
  userId = '',
  searchTitle = '',
  recordId = '',
}) => {

  const {t, i18n} = useTranslation();
  const scrollRef = useRef();

  const [stories, setStories] = useState([]);
  const [LoadMore, setLoadMore] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showEnd,setShowEnd] = useState(false);

  let { refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const OnShowEnd = ()=>{
    if(showEnd) return ;
    setShowEnd(true);
    setTimeout(() => {
     setShowEnd(false);
    }, 2000);
  }

  const getStories = (isNew) => {
    if(isNew)
     setLoading(true);
    else if(LoadMore < 10){
      OnShowEnd();
      return ;
    }

    VoiceService.getStories(isNew?0:stories.length, userId, category, searchTitle, recordId).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        setStories((stories.length==0||isNew)?[...jsonRes]:[...stories,...jsonRes]);
        setLoadMore(jsonRes.length);
        setLoading(false);
        if(isNew)
          scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const onChangeLike = (id, val)=>{
    let tp = [...stories];
    let item = tp[id].isLike;
    if(item == true && val == false){
      tp[id].likesCount --;
    }
    else if(item == false && val == true){
      tp[id].likesCount ++;
    }
    tp[id].isLike = val;
    setStories(tp);
  }

  const storyItems = useMemo(()=>{
    return stories.map((item, index) =>{
      return <VoiceItem 
        key={index+screenName}
        props={props}
        info = {item}
        onChangeLike ={(isLiked)=>onChangeLike(index, isLiked)}
      />}
    )},[stories,refreshState])

  useEffect(() => {
    getStories(loadKey == 0);
  }, [refreshState, loadKey, category])
 
  return <>
    {(
      !loading?(stories.length>0?storyItems:
      <View style = {{marginTop:windowHeight/20,alignItems:'center',width:windowWidth}}>
        <SvgXml
            xml={box_blankSvg}
        />
        <DescriptionText
          text = 'No result found'
          fontSize = {17}
          lineHeight = {28}
          marginTop = {22}
        />
      </View>):
      <Progress.Circle
        indeterminate
        size={30}
        color="rgba(0, 0, 255, .7)"
        style={{ alignSelf: "center", marginTop:windowHeight/20 }}
      />
    )}
    {showEnd&&
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center', padding:12}}>
        <Image
          style={{
            width:20,
            height:20
          }}
          source={require('../../assets/common/happy.png')} 
        />
        <DescriptionText
          marginLeft={15}
          text = {t("You are up to date 🎉! Share vocco with you friends!")}
        />
      </View>
    }
  </>
};
