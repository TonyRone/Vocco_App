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
import SwipeDownModal from 'react-native-swipe-down';
import { useSelector } from 'react-redux';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from './DescriptionText';
import { styles } from '../style/Common';

export const TemporaryStories = ({
  props,
  userId = "",
  onSetExpandKey =()=>{},
}) => {
  const {t, i18n} = useTranslation();
  const scrollRef = useRef();

  const [stories, setStories] = useState([]);
  const [temFlag, setTemFlag] = useState(-1);
  const [LoadMore, setLoadMore] = useState(10);
  const [loading, setLoading] = useState(true);
  const [confirmModal,setConfirmModal] = useState(false);

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
            if(element.user.id == user.id && flag ==-1){
              flag = index;
            }
          });
          setTemFlag(flag);
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
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
    {userId==''&&<Pressable
      style={{
        width:temFlag>=0?58:56,
        marginRight:16
      }}
      onPress={() =>temFlag>=0?props.navigation.navigate('VoiceProfile', {info:stories[temFlag]}):onSetExpandKey()}
      onLongPress={()=>temFlag>=0?setConfirmModal(true):null}
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
        {t("Your story")}
      </Text>
    </Pressable>}
    {useMemo(()=>stories.map((item,index)=>
      (userId==''&&item.user.id == user.id)?null:
      <FriendItem 
        key={index+item.id+'friendItem_feed'}
        props={props}
        info = {item}
        isUserName = {userId==''?true:false}
    />),[stories])}
    </ScrollView>
    <SwipeDownModal
      modalVisible={confirmModal}
      ContentModal={
        <View style={{height:'100%',width:'100%'}}>
          <View style={{position:'absolute', width:windowWidth-16, bottom:92, marginHorizontal:8,height:56,borderRadius:14,backgroundColor:'#E9EAEC'}}>
            <Pressable onPress={()=>{props.navigation.navigate("HoldRecord", {isTemporary: true});setConfirmModal(false);}}>
              <DescriptionText
                  text = {t("Add new story")}
                  fontSize = {20}
                  lineHeight = {24}
                  color = '#1E61EB'
                  textAlign='center'
                  marginTop={16}
              />
            </Pressable>
          </View>
          <View style={{position:'absolute', width:windowWidth-16, bottom:28, marginHorizontal:8,height:56,borderRadius:14,backgroundColor:'white'}}>
            <Pressable onPress={()=>setConfirmModal(false)}>
              <DescriptionText
                  text = {t('Cancel')}
                  fontSize = {20}
                  lineHeight = {24}
                  color = '#E41717'
                  textAlign='center'
                  marginTop={16}
              />
            </Pressable>
          </View>
        </View>
      }
      ContentModalStyle={styles.swipeModal}
      onRequestClose={() => {setConfirmModal(false)}}
      onClose={() => {
          setConfirmModal(false);
      }}
    /> 
  </View>
};
