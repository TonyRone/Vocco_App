import React, { useState, useEffect, useRef, useMemo} from 'react';
import { 
  View, 
  ScrollView,
  Image,
  Pressable,
  Text,
  Platform
} from 'react-native';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import * as Progress from "react-native-progress";
import { VoiceItem } from './VoiceItem';
import { FriendItem } from './FriendItem';
import { SvgXml } from 'react-native-svg';
import plusSvg from '../../assets/Feed/plus.svg'
import box_blankSvg from '../../assets/discover/box_blank.svg';
import { windowHeight, windowWidth } from '../../config/config';
import { useSelector } from 'react-redux';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from './DescriptionText';

export const TemporaryStories = ({
  props,
  userId = "",
}) => {

  const {t, i18n} = useTranslation();
  const scrollRef = useRef();

  const [stories, setStories] = useState([]);
  const [temFlag, setTemFlag] = useState(0);
  const [LoadMore, setLoadMore] = useState(10);
  const [loading, setLoading] = useState(true);

  let { user, refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const getTemporaryStories = () => {
    VoiceService.getTemporaryList(userId).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        setStories([...jsonRes]);
        if(userId == ''){
          let flag = -1;
          jsonRes.forEach((element,index) => {
            if(element.temporary == true && element.user.id == user.id && flag ==-1){
              flag = index;
              setTemFlag(flag);
            }
          });
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    getTemporaryStories();
  }, [refreshState])
 
  return <View style={{flexDirection:'row', paddingHorizontal:16}}>
    {userId==''&&<Pressable
      style={{
        width:temFlag>=0?58:56,
        marginRight:16
      }}
      onPress={() =>temFlag>=0?props.navigation.navigate('VoiceProfile', {info:stories[temFlag]}):props.navigation.navigate("HoldRecord", {isTemporary: true})}
    >
      <Image
        source={{uri:user.avatar.url}}
        style={{width:temFlag>=0?58:56,height:temFlag>=0?58:56,borderRadius:temFlag>=0?29:28,}}
        resizeMode='cover'
      />
      <View style={{
        position:'absolute',
        backgroundColor:'rgba(131, 39, 216, 0.4)',
        width:temFlag>=0?58:56,
        height:temFlag>=0?58:56,
        borderRadius:temFlag>=0?29:28,
        borderWidth:temFlag>=0?2:0,
        borderColor:"#FD4146"
      }}>
      </View>
      <View
        style={{
          position:'absolute',
          top:17,
          left:17
        }}
      >
        <SvgXml
          width={temFlag>=0?24:22}
          height={temFlag>=0?24:22}
          xml={plusSvg}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontSize:12,
          fontFamily:"SFProDisplay-Regular",
          letterSpacing:0.066,
          color: 'rgba(54, 36, 68, 0.8)',
          textAlign:"center",
          marginTop:8
        }}
      >
        {t("You")}
      </Text>
    </Pressable>}
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      {useMemo(()=>stories.map((item,index)=>
        (userId==''&&item.user.id == user.id)?null:
        <FriendItem 
          key={index+'friendItem_feed'}
          props={props}
          info = {item}
          IsUserName = {userId==''}
      />),[stories])}
    </ScrollView> 
  </View>
};
