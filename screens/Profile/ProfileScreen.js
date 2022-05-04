import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Pressable,
  Platform
} from 'react-native';

import * as Progress from "react-native-progress";
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { BottomButtons } from '../component/BottomButtons';
import LinearGradient from 'react-native-linear-gradient';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { VoiceItem } from '../component/VoiceItem';

import { SvgXml } from 'react-native-svg';
import editSvg from '../../assets/common/edit.svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import boxbackArrowSvg from '../../assets/profile/box_backarrow.svg';

import { useSelector } from 'react-redux';
import { setRefreshState } from '../../store/actions';
import { useDispatch } from 'react-redux';

import { FlatList } from 'react-native-gesture-handler';
import { styles } from '../style/Common';
import VoiceService from '../../services/VoiceService';
import { PostContext } from '../component/PostContext';
import { windowHeight, windowWidth} from '../../config/config';

const ProfileScreen = (props) => {

  let { user, refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const dispatch = useDispatch();

  const {t, i18n} = useTranslation();

  let userData = {...user};
  const[voices,setVoices] = useState([]);
  const [userInfo,setUserInfo] = useState({});
  const [nowVoice, setNowVoice] = useState(null);
  const [refresh,setRefresh] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const [loadmore, setloadmore] = useState(10);
  const [loading, setLoading] = useState(false);

  if(props.navigation.state.params)
    ()=>setRefresh(!refresh);

  const getUserVoices = () => {
    if(loadmore < 10)
      return ;
    if(voices.length==0)
      setLoading(true);
    VoiceService.getUserVoice(userData.id,voices.length).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        if(jsonRes.length>0)
          setVoices(voices.length==0?jsonRes:[...voices,...jsonRes]);
        setloadmore(jsonRes.length);
        setLoading(false);
      } 
    })
    .catch(err => {
      console.log(err);
    });
  }
  const getUserInfo = () =>{
    VoiceService.getProfile(userData.id).then(async res=>{
      if(res.respInfo.status == 200){
        const jsonRes = await res.json();
        setUserInfo(jsonRes);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const onStopPlay = () => {
    setNowVoice(null);
  };
  const renderName = (fname,lname)=>{
    let fullname='';
    if(fname)
        fullname = fname;
    if(lname){
        if(fname) fullname+=' ';
        fullname += lname;
    }
    return fullname
}
  const setLiked = ()=>{
    let tp = voices;
    tp[selectedIndex].islike = !tp[selectedIndex].islike;
    setVoices(tp);
  }

  const pressPlayVoice = (index)=>{
    if(nowVoice!=null){
      onStopPlay();
    }
    if(nowVoice!=index){
      setTimeout(() => {
        setNowVoice(index);
      }, nowVoice?400:0);
    }
  }
  const tapHoldToAnswer = (index) => {
    setSelectedIndex(index)
    setShowContext(true);
  }

  useEffect(() => {
    getUserVoices();
    getUserInfo();
  }, [refreshState])
  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <Image
        source={{uri:userData.avatar.url}}
        resizeMode="cover"
        style={styles.topProfileContainer}
      />
      <Pressable style={{position: 'absolute',top: 0}} onLongPress={()=>props.navigation.navigate('Photo',{imageUrl:userData.avatar.url,backPage:'Profile'})}>
        <LinearGradient
          colors={['rgba(52, 50, 56, 0)', 'rgba(42, 39, 47, 0)', 'rgba(39, 36, 44, 0.65)', 'rgba(34, 32, 38, 0.9)']}
          locations={[0, 0.63, 0.83, 1]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={[
            styles.topProfileContainer,
            {
              paddingBottom: 17,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              borderBottomWidth: userData.premium=="none"?0:3,
              borderLeftWidth: userData.premium=="none"?0:3,
              marginLeft:userData.premium=="none"?0:-3,
            }
          ]}
        >
          <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{position:'absolute',left:0,top:Platform.OS=='ios'?24:12}}>
            <SvgXml
              xml = {boxbackArrowSvg}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Voices")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.voices?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Followers")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.followers?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Following")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.followings?.count}
              fontSize={22}
              fontFamily="SFProDisplay-Bold"
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
        </LinearGradient>
      </Pressable>
      <View style={styles.paddingH16}>
        <View style={[styles.rowSpaceBetween, { marginTop: 26 }]}>
          <View>
            <View style={styles.rowAlignItems}>
              <TitleText
                text={userData.name}
                fontFamily="SFProDisplay-Bold"
                lineHeight={33}
              />
              {userData.premium!='none'&&
                <Image
                  style={{
                    width:100,
                    height:33,
                    marginLeft:16
                  }}
                  source={require('../../assets/common/premiumstar.png')}
                />
              }
            </View>
            <DescriptionText
              text={renderName(userData.firstname,userData.lastname)}
              fontSize={12}
              lineHeight={16}
              color={'rgba(54, 36, 68, 0.8)'}
              marginTop={3}
            />
          </View>
          <View style={[styles.contentCenter, { height: 40, width: 40, borderRadius: 20, backgroundColor: '#F8F0FF' }]}>
            <TouchableOpacity onPress={()=>props.navigation.navigate('EditProfile')}>
              <SvgXml
                width={18}
                height={18}
                xml={editSvg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TitleText
          text={t('Your voices')}
          fontSize = {20}
          marginTop={23}
          marginBottom={3}
        />
      </View>
      {!loading?(voices.length?<FlatList
        style={{marginTop:3,marginBottom:70}}
        data={voices}
        renderItem={({item,index})=><VoiceItem 
          key={index+'profile'}
          info={item}
          props={props}
          isPlaying = {index==nowVoice}
          onPressPostContext={()=>tapHoldToAnswer(index)}
          onPressPlay={() => pressPlayVoice(index)}
          onStopPlay={()=>onStopPlay()}
        />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached = {()=>getUserVoices()}
        onEndReachedThreshold = {0.1}
        onEndThreshold={0}
      />:
      <View style = {{marginTop:windowHeight/9,alignItems:'center',width:windowWidth}}>
        <SvgXml
            xml={box_blankSvg}
        />
        <DescriptionText
          text = {t('No result found')}
          fontSize = {17}
          lineHeight = {28}
          marginTop = {22}
        />
      </View>):
      <Progress.Circle
        indeterminate
        size={30}
        color="rgba(0, 0, 255, .7)"
        style={{ alignSelf: "center", marginTop:windowHeight/9 }}
      />
      }
      <BottomButtons
        active='profile'
        props={props}
      />
      {showContext&&
        <PostContext
          postInfo = {voices[selectedIndex]}
          props = {props}
          onChangeIsLike = {()=>setLiked()}
          onCloseModal = {()=>setShowContext(false)}
        />
      }
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;