
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  Image,
  Platform,
  Animated,
  PermissionsAndroid,
  TouchableOpacity,
  Vibration
} from 'react-native';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import * as Progress from "react-native-progress";
import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import RNFetchBlob from 'rn-fetch-blob';
import SwipeDownModal from 'react-native-swipe-down';
import Draggable from 'react-native-draggable';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from './TitleText';
import { Warning } from './Warning';
import { windowHeight, windowWidth } from '../../config/config';
import cancelSvg from '../../assets/record/cancel.svg';
import publicSvg from '../../assets/record/public.svg';
import { DescriptionText } from './DescriptionText';
import VoicePlayer from '../Home/VoicePlayer';
import VoiceService from '../../services/VoiceService';
import { useDispatch, useSelector } from 'react-redux';
import { setVoiceState, setRefreshState } from '../../store/actions';
import {useTranslation} from 'react-i18next';
import { styles } from '../style/Common';
import '../../language/i18n';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import { SvgXml } from 'react-native-svg';
import { setUseProxies } from 'immer';
//import { TouchableOpacity } from 'react-native-gesture-handler';

export const AnswerReply = ({
    props,
    info,
    onCancel =()=>{},
    onPushReply=()=>{}
}) => {

  let { user , voiceState , refreshState } = useSelector((state) => state.user) ;

  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const [fill, setFill] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isPublish, setIsPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState(0);

  const wasteTime = useRef(0);
  const dragPos = useRef(0);

  recorderPlayer.setSubscriptionDuration(0.2); // optional. Default is 0.1

  const dirs = RNFetchBlob.fs.dirs;

  const path = Platform.select({
    ios: `${dirs.CacheDir}/hello.m4a`,
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  const clearRecorder = async ()=>{
      wasteTime.current = 0;
      await recorderPlayer.resumeRecorder();
      await recorderPlayer.stopRecorder();
      recorderPlayer.removeRecordBackListener();
  }

  const closeModal = ()=>{
    setShowModal(false);
    onCancel();
  }

  useEffect(() => {
    setFill(user.premium=='none'?60:180);
    setKey(prevKey => prevKey + 1);
    return ()=>clearRecorder();
  }, [])

  const onStartRecord = async () => {
    if(isRecording==false){
      setIsRecording(true);
      setIsPaused(false);
      dragPos.current = 0;
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
      await recorderPlayer.startRecorder(path, audioSet);
      recorderPlayer.addRecordBackListener((e) => {
        wasteTime.current = e.currentPosition;
        if(e.currentPosition >= fill*1000){
          onStopRecord(true);
        }
      });
    }
  };

  const onStopRecord = async (publish) => {
    setIsRecording(false);
    setIsPaused(true);
    if(publish == true){
        setDuration(wasteTime.current);
        clearRecorder();
        setIsPublish(true);
    }
    if(publish == false){
      closeModal();
    }
  };
 
  const onChangeRecord = async (e, v = false )=>{
    if(v == true && isRecording == false){
      onStartRecord();
    }
    else {
      if(v == true && isPaused){
        await recorderPlayer.resumeRecorder();
        setIsPaused(false);
      }
      else if( v== false && isRecording == true){
        if(Math.abs(dragPos.current) < 80){
          await recorderPlayer.pauseRecorder();
          setIsPaused(true);
        }
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    if (path) {
      let tp = Math.max(wasteTime.current,1);
      let voiceFile = [
        { name:'duration', data:String(Math.ceil(tp/1000.0)) },
        { name:'record', data:info.id },
        { name: 'file', filename:Platform.OS==='android'?'answer.mp3':'answer.m4a', data: RNFetchBlob.wrap(String(path))},
      ] ;
      VoiceService.postAnswerReply(voiceFile).then(async res => { 
        const jsonRes = await res.json();
        if (res.respInfo.status !== 201) {
        } else {
          Vibration.vibrate(100);
          onPushReply();
          closeModal();
        }
        setIsLoading(false);
      })
      .catch(err => {
          console.log(err);
      });
    }
  }

  return (
    <SwipeDownModal
      modalVisible={showModal}
      ContentModal={
        <>
        {isPublish?
          <View style={{
            position:'absolute',
            width:windowWidth,
            bottom:50,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center'
          }}>
            <View
              style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between',
                paddingRight: 12,
                paddingVertical: 8,
                backgroundColor: '#FFF',
                shadowColor: 'rgba(176, 148, 235, 1)',
                elevation:10,
                shadowOffset:{width: 0, height: 2},
                shadowOpacity:0.5,
                shadowRadius:8,
                borderRadius: 30,
              }}
            >
              <VoicePlayer
                playBtn = {true}
                waveColor={info.user.premium != 'none'?['#FFC701','#FFA901','#FF8B02']:['#D89DF4', '#B35CF8','#8229F4']}
                playing = {false}
                stopPlay = {()=>{}}
                startPlay = {()=>{}}
                tinWidth={windowWidth/300}
                mrg={windowWidth/600}
                duration = {duration}
              />
              <TouchableOpacity onPress={()=>closeModal()}>
                <SvgXml
                    width={24}
                    height={24}
                    xml ={redTrashSvg}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={isLoading} onPress={handleSubmit}>
              <Image
                  style={{
                    height:56,
                    width:56,
                    marginLeft:4
                  }}
                  resizeMode="stretch"
                  source={require('../../assets/post/answerPublish.png')}
              />
            </TouchableOpacity>
          </View>
          :<>
            <Image
                style={{
                  position:'absolute',
                  bottom:50,
                  height:56,
                  width:281.22,
                  right:(windowWidth-281.22)/2
                }}
                resizeMode="stretch"
                source={require('../../assets/post/answerReply.png')}
            />
            <View style={{position:'absolute',bottom:135,width:'100%',alignItems:'center'}}>
              <Draggable 
                  key={key}
                  x={windowWidth / 2 - 34} 
                  y={0}
                  shouldReverse={true}
                  minX={windowWidth / 2 - 110}
                  maxX={windowWidth / 2 + 110}
                  minY={0}
                  maxY={0}
                  touchableOpacityProps={{
                    activeOpactiy: 0.1,
                  }}
                  onDrag={(event, gestureState) => {
                  }}
                  onDragRelease={(event, gestureState, bounds) => {
                    dragPos.current = gestureState.dx;
                    if(gestureState.dx>80)
                      onStopRecord(true)
                    else if(gestureState.dx<-80)
                      onStopRecord(false);
                  }}
                  onReverse={() => {
    
                  }}
                  
                >
                  <View
                    onTouchStart={(e)=>onChangeRecord(e, true )}
                    onTouchEnd={(e)=>onChangeRecord( e, false )}
                  >
                    <SvgXml
                      width={68}
                      height={68}
                      xml={recordSvg}
                    />
                  </View>
              </Draggable>
            </View>
            <View style={{
              position:'absolute',
              bottom:160,
              right:(windowWidth-105)/2,
              width:105,
              height:48,
              backgroundColor:"#FFF",
              borderRadius:16,
              flexDirection:'row',
              alignItems:'center',
              paddingHorizontal:16,
            }}>
              <View
                style={{
                  width:8,
                  height:8,
                  borderRadius:4,
                  backgroundColor:"#E41717"
                }}
              >
              </View>
              {/* <DescriptionText
                text={new Date(wasteTime.current).toISOString().substr(14, 5)}
                lineHeight={24}
                fontSize={15}
                marginLeft={12}
              /> */}
              <CountdownCircleTimer
                key={key}
                isPlaying={!isPaused}
                duration={fill}
                size={70}
                strokeWidth={0}
                trailColor="#D4C9DE"
                trailStrokeWidth={0}
                onComplete = {()=>onStopRecord(true)}
                colors={[
                  ['#B35CF8', 0.4],
                  ['#8229F4', 0.4],
                  ['#8229F4', 0.2],
                ]}
              >
                {({ remainingTime, animatedColor }) => {
                  return (
                    <DescriptionText
                      text={new Date(wasteTime.current).toISOString().substr(14, 5)}
                      lineHeight={24}
                      color="rgba(54, 36, 68, 0.8)"
                      fontSize={15}
                    />
                  )
                }}
              </CountdownCircleTimer>
            </View>
          </>}
          {isLoading&&
          <Progress.Circle
            indeterminate
            size={30}
            color="rgba(0, 0, 255, .7)"
            style={{ alignSelf: "center", marginTop:windowHeight/2 }}
          />}
       </>
      }
      ContentModalStyle={[styles.swipeModal,{backgroundColor: 'rgba(0, 0, 0, 0.1)'}]}
      onRequestClose={() => closeModal()}
      onClose={() => 
          closeModal()
      }
    />
  );
};