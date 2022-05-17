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

import { windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshState } from '../../store/actions';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from '../component/DescriptionText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TemporaryStories } from '../component/TemporaryStories';
import { RecordIcon } from '../component/RecordIcon';

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
  const [notify, setNotify] = useState(false);

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
        setTemporaryStories([...jsonRes]);
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

  const getNewNotifyCount=()=>{
    VoiceService.unreadActivityCount().then(async res => {
        if (res.respInfo.status == 201) {
            const jsonRes = await res.json();
            if(jsonRes.count > 0)
              setNotify(true);
            else{
              VoiceService.unreadRequestCount().then(async res => {
                  if (res.respInfo.status == 201) {
                      const jsonRes = await res.json();
                      if(jsonRes.count > 0)
                        setNotify(true);
                      else
                        setNotify(false);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
        }
     })
     .catch(err => {
       console.log(err);
     });
  }

  let socket = null;

  useEffect(() => {
    getTemporaryStories();
    getNewNotifyCount();
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
          {notify==true&&<View
            style={{
              width:12,
              height:12,
              borderRadius:6,
              marginLeft:6,borderWidth:2,
              borderColor:'#FFF',
              backgroundColor:'#D82783'}}
            >
          </View>}
        </TouchableOpacity>
      </View>
      <TemporaryStories
        props={props}
      />
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
              dispatch(setRefreshState(!refreshState));
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
      <RecordIcon
        props={props}
        bottom={15.5}
        left = {windowWidth/2-27}
      />
    </KeyboardAvoidingView>
  );
};

export default FeedScreen;