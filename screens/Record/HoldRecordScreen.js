
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  Image,
  Platform,
  Animated,
  PermissionsAndroid
} from 'react-native';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import RNFetchBlob from 'rn-fetch-blob';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Draggable from 'react-native-draggable';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from '../component/TitleText';
import { Warning } from '../component/Warning';
import { windowHeight, windowWidth } from '../../config/config';
import cancelSvg from '../../assets/record/cancel.svg';
import publicSvg from '../../assets/record/public.svg';
import { DescriptionText } from '../component/DescriptionText';
import { useDispatch, useSelector } from 'react-redux';
import { setVoiceState } from '../../store/actions';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { SvgXml } from 'react-native-svg';

const HoldRecordScreen = (props) => {

  // var path = RNFS.DocumentDirectoryPath + '/hello.m4a';

  let isTemporary = props.navigation.state.params?.isTemporary;

  let { user , voiceState , refreshState} = useSelector((state) => state.user) ;
  const dispatch = useDispatch();

  let info = props.navigation.state.params?.info;
  const [fill, setFill] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [key, setKey] = useState(0);
  const [hoverState,setHoverState] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [recordTime,setRecordTime] = useState(0);
  const [isTime, setIsTime] = useState(true);

  const audioRecorderPlayer = useRef(recorderPlayer).current;
  audioRecorderPlayer.setSubscriptionDuration(1); // optional. Default is 0.1

  const startAnimation = () => {
    setFill(50);
    setIsPlaying(!isPlaying);
  };

  const stopAnimation = () => {
    progress && progress.performLinearAnimation(fill, 0);
  };

  const restartAnimation = () => {
    progress && progress.performLinearAnimation(0, 0);
    startAnimation();
  };

  const clearRecorder = ()=>{
    audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
  }

  useEffect(() => {
    setFill(user.premium!='none'?180:60);
    setKey(prevKey => prevKey + 1);
    //dispatch(setVoiceState(voiceState+1));
    return ()=>clearRecorder();
  }, [])

  const [disableCBButton, setDisableCBButton] = useState(false)
  const defaultStatusMessage = 'swipe status appears here';
  const [swipeStatusMessage, setSwipeStatusMessage] = useState(
    defaultStatusMessage,
  );

  setInterval(() => setSwipeStatusMessage(defaultStatusMessage), 5000);
  const updateSwipeStatusMessage = (message) => setSwipeStatusMessage(message);
  const renderSubHeading = (heading) => (
    <Text style={styles.subHeading}>{heading}</Text>
  );

  const CheckoutButton = () => {
    return (
      <View style={{ width: 100, height: 30, backgroundColor: '#C70039', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff' }}>Checkout</Text>
      </View>
    );
  }

  const onStartRecord = async () => {
    if(isRecording==false){
      await checkPermission();
      const dirs = RNFetchBlob.fs.dirs;
      const path = Platform.select({
        ios: `hello.m4a`,
        android: `${dirs.CacheDir}/hello.mp3`,
      });
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      dispatch(setVoiceState(voiceState+1));
      audioRecorderPlayer.startRecorder(path, audioSet);
      setStartTime(new Date());
      setRecordTime(0);
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const onStopRecord = (publish) => {
    if(isRecording==true){
      let rtime = recordTime;
      if(startTime)
        rtime += (new Date()-startTime);
      rtime = Math.floor(rtime/1000);
      if(rtime > fill)
        rtime = fill;
      setIsRecording(false);
      setIsPaused(true);
      setKey(prevKey => prevKey + 1);
      setStartTime(null);
      setRecordTime(0);
      setIsTime(true);
      clearRecorder();
      if(publish==true&&rtime>0){
        if(info)
          props.navigation.navigate('PostingAnswerVoice',{info:info,recordSecs:rtime})
        else
          props.navigation.navigate('PostingVoice',{recordSecs:rtime,isTemporary:isTemporary})
      }
    }
    if(publish == false){
      props.navigation.goBack();
    }
  };
 
  const onChangeRecord = ( v = false )=>{
    if(v == true && isRecording == false && isTime){
      onStartRecord();
    }
    else {
      if(v == true && isPaused && isTime){
        audioRecorderPlayer.resumeRecorder();
        setIsPaused(false);
        setStartTime(new Date());
      }
      else if( v== false && isRecording == true){
        
        audioRecorderPlayer.pauseRecorder();
        setIsPaused(true);
        if(startTime){
          setRecordTime(recordTime+(new Date()-startTime));
          setStartTime(null);
        }
      }
    }
  }

  const onTimeEnd = ()=>{
    onStopRecord(true);
  }

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

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
  let r=0;
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        alignItems:'center'
      }}
    >
      {user.premium!='none'&&
      <Image
        style={{
          position:'absolute',
          width:320,
          height:68,
          top:windowHeight/10
        }}
        source={require("../../assets/record/holdpremium.png")}
      />}
      <View style={{alignItems:'center',width:'100%'}}>
        <TitleText 
          text="Click & hold to record" 
          fontSize={20}
          marginTop={10}
          color="#281E30"
        />
        <View
          style={{
            marginTop:windowHeight / 6
          }}
        >
          <CountdownCircleTimer
            key={key}
            isPlaying={!isPaused}
            duration={fill}
            size={250}
            strokeWidth={5}
            trailColor="#D4C9DE"
            trailStrokeWidth={1}
            onComplete = {onTimeEnd}
            colors={[
              ['#B35CF8', 0.4],
              ['#8229F4', 0.4],
              ['#8229F4', 0.2],
            ]}
          >
            {({ remainingTime, animatedColor }) => {
              return (
                <ImageBackground
                  source={require('../../assets/record/Waves.png')}
                  resizeMode="stretch"
                  style={{width:197,height:197,alignItems:'center'}}
                >
                  <DescriptionText
                    text="seconds" 
                    color="rgba(59, 31, 82, 0.6)"
                    fontSize={20}
                    marginTop={32}
                  />
                  <LinearTextGradient
                    style={{ fontSize: 80,marginTop:-10 }}
                    locations={[0, 1]}
                    colors={["#C479FF","#650DD6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <Animated.Text style={{ color: animatedColor, fontFamily: "SFProDisplay-Semibold" }}>
                      { remainingTime }
                    </Animated.Text>
                  </LinearTextGradient>
                </ImageBackground>
              )
            }}
          </CountdownCircleTimer>
        </View>
      </View>
      <View style={{position:'absolute',bottom:'6%',width:'100%',alignItems:'center'}}>
        <ImageBackground
          source={require('../../assets/record/RecordControl.png')}
          resizeMode="stretch"
          style={{width:311,height:76,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}
        >     
          <View 
            style={{flexDirection:'row',alignItems:'center',marginLeft:18}}
          >
            <SvgXml width={20} height={16-(hoverState<0?r*4:0)} xml={cancelSvg} />
            <TitleText
              text="Cancel" 
              fontFamily="SFProDisplay-Regular" 
              fontSize={16}
              marginLeft={8}
              lineHeight={21}
              color="#E41717"
            />
          </View>
          <View style={{flexDirection:'row',alignItems:'center',marginRight:18}}>
            <TitleText
                text="Publish" 
                fontFamily="SFProDisplay-Regular" 
                fontSize={16}
                marginRight={8}
                lineHeight={21}
                color="#8327D8"
            />
            <SvgXml width={20} height={16+(hoverState>0?hoverState*4:0)} xml={publicSvg} />
          </View>
        </ImageBackground>
        <Draggable 
          x={windowWidth / 2 - 38} 
          y={0}
          shouldReverse={true}
          minX={windowWidth / 2 - 120}
          maxX={windowWidth / 2 + 136}
          minY={0}
          maxY={0}
          touchableOpacityProps={{
            activeOpactiy: 0.1,
          }}
          //onShortPressRelease={onChangeRecord}
          onDrag={(event, gestureState) => {
            r = Math.trunc(gestureState.dx/80);
            if(hoverState!=r){
            //  setHoverState(r);
            } 
          }}
          onDragRelease={(event, gestureState, bounds) => {
            if(gestureState.dx>80)
              onStopRecord(true)
            else if(gestureState.dx<-80)
              onStopRecord(false);
          }}
          onReverse={() => {

          }}
        >
          <View
            onTouchStart={()=>onChangeRecord( true )}
            onTouchEnd={()=>onChangeRecord( false )}
          >
            <SvgXml
              width={76}
              height={76}
              xml={recordSvg}
            />
          </View>
        </Draggable>
      </View>
      <Warning
        bottom={'25%'}
        text = 'Hate, racism, sexism or any kind of violence is stricly prohibited'
      />
    </SafeAreaView>
  );
};

export default HoldRecordScreen;