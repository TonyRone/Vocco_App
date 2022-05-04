import React, { useState, useEffect, useRef, useReducer } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TouchableOpacity, 
  Pressable, 
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
  Vibration
} from 'react-native';

import * as Progress from "react-native-progress";
import { TitleText } from '../component/TitleText';
import { FriendItem } from '../component/FriendItem';
import { FlatList } from 'react-native-gesture-handler';
import { VoiceItem } from '../component/VoiceItem';
import { BottomButtons } from '../component/BottomButtons';
import { PostContext } from '../component/PostContext';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

import { SvgXml } from 'react-native-svg';
import notificationSvg from '../../assets/discover/notification.svg';
import closeSvg from '../../assets/common/close.svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import plusSvg from '../../assets/Feed/plus.svg'

import { windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { useSelector } from 'react-redux';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from '../component/DescriptionText';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedScreen = (props) => {

  let new_init = props.navigation.state.params?-1:0;

  const reducer =(noticeCount, action) => {
    if(action == 'news')
      return noticeCount+1;
    if(action == 'reset')
      return 0;
  }

  const [voices, setVoices] = useState([]);
  const [nowVoice, setNowVoice] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const [refresh,setRefresh] = useState(false);
  const [loadmore, setloadmore] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showEnd,setShowEnd] = useState(false);

  const {t, i18n} = useTranslation();

  const [noticeCount, noticeDispatch] = useReducer(reducer,new_init);

  const scrollRef = useRef(null);

  let { user, socketInstance, refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const getVoices = (isNew = false) => {
    if(isNew)
      onStopPlay();
    else if(loading){
      return ;
    }
    else if(loadmore < 10){
      OnShowEnd();
      return ;
    } 
    setLoading(true);
    VoiceService.getHomeVoice(isNew?0:voices.length).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          if(jsonRes.length > 0)
            setVoices((voices.length==0||isNew)?jsonRes:[...voices,...jsonRes]);
          setloadmore(jsonRes.length);
          setLoading(false);
          if(isNew)
            scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const tapHoldToAnswer = (index) => {
    setSelectedIndex(index)
    setShowContext(true);
  }
  
  const onStopPlay = () => {
    setNowVoice(null);
  };

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

  const setLiked = ()=>{
    let tp = voices;
    tp[selectedIndex].islike = !tp[selectedIndex].islike;
    setVoices(tp);
  }

  const OnShowEnd = ()=>{
    if(showEnd) return ;
    setShowEnd(true);
    setTimeout(() => {
     setShowEnd(false);
    }, 2000);
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  let socket = null;

  useEffect(() => {
    checkPermission();
    getVoices(true);
    socketInstance.on("notice_Voice", (data) => {
      // if(data.user_id != user.id){
      // }
      //  socket.off("notice_Voice");
      noticeDispatch("news");
    });
    if(new_init < 0) {
      setTimeout(() => {
        noticeDispatch("reset");
      }, 1500);
    }
  }, [refreshState])

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }
 
  return (
      <SafeAreaView 
        style={{
          backgroundColor:'#FFF',
          flex:1,
        }}
      >
        <View
          style={[
            { marginTop: 20, paddingHorizontal: 20, marginBottom:25, height:30 }, 
            styles.rowJustifyCenter
          ]}
        >
          <TitleText 
            text={user?.name ? t('Hi') + ", " + user.name : t('Hi')+'!'}
            fontSize={24}
            color="#281E30"
          />
          <TouchableOpacity
            style={{
              position:'absolute',
              right:20,
              top:4
            }}
            onPress = {()=>props.navigation.navigate('Notification')}
          >
            <SvgXml 
              width="24" 
              height="24" 
              xml={notificationSvg} 
            />
          </TouchableOpacity>

        </View>
        <View style={{flexDirection:'row', paddingLeft:16}}>
          <Pressable
            style={{
              width:56,
            }}
            onPress={() => props.navigation.navigate("HoldRecord", {isTemporary: true})}
          >
            <Image
              source={{uri:user.avatar.url}}
              style={{width:56,height:56,borderRadius:16}}
              resizeMode='cover'
            />
            <View style={{
              position:'absolute',
              backgroundColor:'rgba(131, 39, 216, 0.4)',
              width:56,
              height:56,
              borderRadius:16
            }}>
            </View>
            <View
              style={{
                position:'absolute',
                top:16,
                left:16
              }}
            >
              <SvgXml
                width={22}
                height={22}
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
              You
            </Text>
          </Pressable>
          <FlatList
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            style={{paddingLeft:16}}
            data = {voices}
            renderItem={({item,index})=>
              !item.temporary?null:
              <FriendItem 
                key={index+'frienditem_feed'}
                props={props}
                info = {item}
              />
            }
            keyExtractor={(item, index) => index.toString()} 
          /> 
        </View>
        <ScrollView
          style = {{marginBottom:80, marginTop:25}}
          ref={scrollRef}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              getVoices(false);
            }
          }}
          scrollEventThrottle={400}
        >
          {!loading?(voices.length>0? 
          voices.map((item,index)=>
            item.temporary?null:
            <VoiceItem 
              key={index+'voiceitem_feed'}
              props={props}
              info = {item}
              isPlaying = {index==nowVoice}
              isRefresh = {refresh}
              onPressPostContext={()=>tapHoldToAnswer(index)}
              onPressPlay={() => pressPlayVoice(index)}
              onStopPlay={()=>onStopPlay()}
              spread = {nowVoice==null}
            />
          )
          :
          <View style = {{marginTop:windowHeight/9,alignItems:'center',width:windowWidth}}>
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
            style={{ alignSelf: "center", marginTop:windowHeight/5 }}
          />
          }
          {
            noticeCount != 0&&
            <TouchableOpacity style={{
              position:'absolute',
              top:220,
              left:windowWidth/2-78,
              width:noticeCount<0?183:156, 
              height:40, 
              backgroundColor:noticeCount<0?'#45BF58':'#8327D8', 
              borderRadius:34, 
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center'
            }}
              onPress = {()=>{
                if(noticeCount > 0 ){
                  getVoices(true);
                  Vibration.vibrate(100);
                }
                noticeDispatch("reset");
              }}
            >
              <DescriptionText
                text={noticeCount<0?'Successful upload':(noticeCount+' new voices')}
                color='#F6EFFF'
                marginLeft={16}
                fontSize={15}
                lineHeight={15}
              />
              <SvgXml
                width={20}
                height={20}
                style={{marginRight:14}}
                xml = {closeSvg}
              />
            </TouchableOpacity>
          }
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
                text = {t("You are up to date!")}
              />
            </View>
          }
        </ScrollView>
        {showContext&&
          <PostContext
            postInfo = {voices[selectedIndex]}
            props = {props}
            onChangeIsLike = {()=>setLiked()}
            onCloseModal = {()=>setShowContext(false)}
          />
        }
        <BottomButtons 
          active='home'
          props={props}
        />
      </SafeAreaView>
  );
};

export default FeedScreen;