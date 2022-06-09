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
import { TitleText } from './TitleText';
import { FriendItem } from './FriendItem';
import { FlatList } from 'react-native-gesture-handler';
import { VoiceItem } from './VoiceItem';
import { BottomButtons } from './BottomButtons';
import { Stories } from './Stories';
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
import { DescriptionText } from './DescriptionText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TemporaryStories } from './TemporaryStories';
import { RecordIcon } from './RecordIcon';
import { MyButton } from './MyButton';

export const Feed = ({
  props,
  onSetExpandKey =()=>{}
}) => {

  const [loadKey, setLoadKey] = useState(0);

  const {t, i18n} = useTranslation();

  const scrollRef = useRef();

  let { user, socketInstance, refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const dispatch = useDispatch();

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  let socket = null;

  useEffect(() => {

  }, [])
 
  return (
    <View 
      style={{
        backgroundColor:'#FFF',
        width:windowWidth,
        flex:1,
      }}
    >
      <TemporaryStories
        props={props}
        onSetExpandKey= {()=>onSetExpandKey()}
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
    </View>
  );
};
