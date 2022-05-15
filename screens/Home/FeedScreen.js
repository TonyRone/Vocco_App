import React, { useState, useEffect, useRef, useReducer , useMemo , useCallback} from 'react';
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
import { Stories } from '../component/Stories';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

import { SvgXml } from 'react-native-svg';
import notificationSvg from '../../assets/discover/notification.svg';
import closeSvg from '../../assets/common/close.svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import plusSvg from '../../assets/Feed/plus.svg'

import { windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshState } from '../../store/actions';
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

  const [temporaryStories, setTemporaryStories] = useState([]);
  const [temFlag,setTemFlag] =  useState(-1);
  const [loadKey, setLoadKey] = useState(0);


  const {t, i18n} = useTranslation();

  const [noticeCount, noticeDispatch] = useReducer(reducer,new_init);

  const scrollRef = useRef();

  let { user, socketInstance, refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const dispatch = useDispatch();

  const getTemporaryStories = () => {
    VoiceService.getTemporaryList().then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        setTemporaryStories(jsonRes);
        console.log(jsonRes.length+" LLLLLLLLLLLLLLLL");
        let flag = -1;
        jsonRes.forEach((element,index) => {
          if(element.temporary == true && element.user.id == user.id && flag ==-1){
            flag = index;
            setTemFlag(flag);
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  let socket = null;

  useEffect(() => {
    getTemporaryStories();
    socketInstance.on("notice_Voice", (data) => {
      noticeDispatch("news");
    });
    if(new_init < 0) {
      setTimeout(() => {
        noticeDispatch("reset");
      }, 1500);
    }
    return socketInstance.off("notice_Voice");
  }, [refreshState])
 
  return (
    <KeyboardAvoidingView 
      style={{
        backgroundColor:'#FFF',
        flex:1,
      }}
    >
      <View
        style={[
          { marginTop:Platform.OS=='ios'?50:20, paddingHorizontal: 20, marginBottom:25, height:30 }, 
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
            width:temFlag>=0?58:56,
          }}
          onPress={() =>temFlag>=0?props.navigation.navigate('VoiceProfile', {info:voices[temFlag]}):props.navigation.navigate("HoldRecord", {isTemporary: true})}
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
            You
          </Text>
        </Pressable>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{paddingLeft:16}}
        >
          {useMemo(()=>temporaryStories.map((item,index)=>
            item.user.id == user.id?null:
            <FriendItem 
              key={index+'friendItem_feed'}
              props={props}
              info = {item}
          />),[temporaryStories])}
        </ScrollView> 
      </View>
      <ScrollView
        style = {{marginBottom:Platform.OS=='ios'?65:75, marginTop:10}}
        ref={scrollRef}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            setLoadKey(loadKey+1);
          }
        }}
        scrollEventThrottle={400}
      >
        <Stories
          props={props}
          loadKey = {loadKey}
          screenName = "Feed"
        />
      </ScrollView>
      {
        noticeCount != 0&&
        <TouchableOpacity style={{
          position:'absolute',
          top:160,
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
            dispatch(setRefreshState(!refreshState));
          }}
        >
          <DescriptionText
            text={noticeCount<0?t("Successful upload"):(noticeCount+' '+t("new voices"))}
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
      <BottomButtons 
        active='home'
        props={props}
      />
    </KeyboardAvoidingView>
  );
};

export default FeedScreen;