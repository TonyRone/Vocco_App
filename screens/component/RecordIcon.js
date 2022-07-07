
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Platform,
  Animated,
  Pressable,
  Vibration,
  TouchableOpacity,
} from 'react-native';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import RNFetchBlob from 'rn-fetch-blob';
import RNVibrationFeedback from 'react-native-vibration-feedback';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Draggable from 'react-native-draggable';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from './TitleText';
import { Warning } from './Warning';
import { windowHeight, windowWidth } from '../../config/config';
import cancelSvg from '../../assets/record/cancel.svg';
import publicSvg from '../../assets/record/public.svg';
import { DescriptionText } from './DescriptionText';
import { useDispatch, useSelector } from 'react-redux';
import { setVoiceState } from '../../store/actions';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { SvgXml } from 'react-native-svg';
import { SemiBoldText } from './SemiBoldText';

export const RecordIcon = ({
  props,
  dem = 54,
  expandKey = 0,
  bottom,
  left,
}) => {

  let { user, voiceState, refreshState } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const [fill, setFill] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [key, setKey] = useState(0);
  const [hoverState, setHoverState] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [IsExpanded, setIsExpanded] = useState(false);
  const [expand, setExpand] = useState(0);
  const [temporary, setTemporary] = useState(false);

  const wasteTime = useRef(0);
  const dragPos = useRef(0);

  recorderPlayer.setSubscriptionDuration(0.5); // optional. Default is 0.1

  const startAnimation = () => {
    setFill(50);
    setIsPlaying(!isPlaying);
  };

  const clearRecorder = async () => {
    wasteTime.current = 0;
    await recorderPlayer.resumeRecorder();
    await recorderPlayer.stopRecorder()
    recorderPlayer.removeRecordBackListener();
  }

  const onStartRecord = async () => {
    if (isRecording == false) {
      dragPos.current = 0;
      setIsRecording(true);
      setIsPaused(false);
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
      dispatch(setVoiceState(voiceState + 1));
      clearRecorder().then(async res => {
        await recorderPlayer.startRecorder(path, audioSet);
        recorderPlayer.addRecordBackListener((e) => {
          wasteTime.current = e.currentPosition;
        });
      });
    }
  };

  const onStopRecord = async (publish) => {
    if (isRecording == true) {
      setIsRecording(false);
      setIsPaused(true);
      setKey(prevKey => prevKey + 1);
      if (publish == true) {
        let tp = Math.max(wasteTime.current, 1);
        props.navigation.navigate('PostingVoice', { recordSecs: Math.ceil(tp / 1000.0), isTemporary: temporary })
        setTemporary(false);
        clearRecorder();
        setIsExpanded(false);
      }
      else {
        clearRecorder();
        setIsExpanded(false);
      }
    }
  };

  const onChangeRecord = async (e, v = false) => {
    if (v == true)
      RNVibrationFeedback.vibrateWith(1519);
    if (v == true && isRecording == false) {
      setIsExpanded(true);
      onStartRecord();
    }
    else {
      if (v == true && isPaused) {
        await recorderPlayer.resumeRecorder();
        setIsPaused(false);
      }
      else if (v == false && isRecording == true) {
        let delta = Math.abs(dragPos.current);
        if (delta < 80) {
          await recorderPlayer.pauseRecorder();
          setIsPaused(true);
        }
      }
    }
  }

  const onTimeEnd = () => {
    onStopRecord(true);
  }

  let r = 0;

  useEffect(() => {
    setFill(user.premium != 'none' ? 180 : 60);
    setKey(prevKey => prevKey + 1);
    if (expandKey != expand) {
      setExpand(expandKey);
      setIsExpanded(true);
      setTemporary(true);
    }
    //dispatch(setVoiceState(voiceState+1));
    return () => clearRecorder();
  }, [expandKey])

  return (
    <Pressable
      style={{
        position: 'absolute',
        bottom: IsExpanded ? 0 : bottom,
        left: IsExpanded ? 0 : left,
        width: IsExpanded ? windowWidth : dem,
        height: IsExpanded ? windowHeight : dem,
        elevation: 11
      }}
      onPress={() => onStopRecord(false)}
    >
      {IsExpanded && <View
        style={{
          backgroundColor: '#FFF',
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: windowHeight / 10,
            paddingHorizontal: 16,
            paddingVertical: 8,
            width: 295,
            backgroundColor: '#FFF7E8',
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#FFBB02',
            shadowColor: '#FFB800',
            elevation: 10,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
        >
          <SemiBoldText
            text={user.premium != 'none' ? 'You are a premium member and you have up to three minutes of recording!' : 'Go to Premium and have 3 minutes instead of one for each record'}
            color='#F09E00'
            fontSize={15}
            lineHeight={24}
            textAlign='center'
          />
        </View>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <TitleText
            text={t("Click & hold to record")}
            fontSize={20}
            marginTop={30}
            color="#281E30"
          />
          <View
            style={{
              marginTop: windowHeight / 6
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
              onComplete={onTimeEnd}
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
                    style={{ width: 197, height: 197, alignItems: 'center' }}
                  >
                    <DescriptionText
                      text={t("seconds")}
                      color="rgba(59, 31, 82, 0.6)"
                      fontSize={20}
                      marginTop={32}
                    />
                    <LinearTextGradient
                      style={{ fontSize: 80, marginTop: -10 }}
                      locations={[0, 1]}
                      colors={["#C479FF", "#650DD6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <Animated.Text style={{ color: animatedColor, fontFamily: "SFProDisplay-Semibold" }}>
                        {fill - Math.floor(wasteTime.current / 1000)}
                      </Animated.Text>
                    </LinearTextGradient>
                  </ImageBackground>
                )
              }}
            </CountdownCircleTimer>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: '6%', width: '100%', alignItems: 'center' }}>
          <ImageBackground
            source={require('../../assets/record/RecordControl.png')}
            resizeMode="stretch"
            style={{ width: 311, height: 76, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}
            >
              <SvgXml width={20} height={16 - (hoverState < 0 ? r * 4 : 0)} xml={cancelSvg} />
              <TitleText
                text={t("Cancel")}
                fontFamily="SFProDisplay-Regular"
                fontSize={16}
                marginLeft={8}
                lineHeight={21}
                color="#E41717"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
              <TitleText
                text={t("Publish")}
                fontFamily="SFProDisplay-Regular"
                fontSize={16}
                marginRight={8}
                lineHeight={21}
                color="#8327D8"
              />
              <SvgXml width={20} height={16 + (hoverState > 0 ? hoverState * 4 : 0)} xml={publicSvg} />
            </View>
          </ImageBackground>
        </View>
        <Warning
          bottom={'25%'}
          text={t("Hate, racism, sexism or any kind of violence is stricly prohibited")}
        />
      </View>}
      <View style={{ position: IsExpanded ? 'absolute' : 'relative', bottom: '6%', width: IsExpanded ? '100%' : 54, height: IsExpanded ? 76 : 54 }}>
        <Draggable
          key={key}
          x={IsExpanded ? windowWidth / 2 - 38 : 0}
          y={0}
          shouldReverse={true}
          minX={windowWidth / 2 - 120}
          maxX={windowWidth / 2 + 136}
          minY={0}
          maxY={0}
          touchableOpacityProps={{
           // activeOpactiy: 1,
          }}
          onDrag={(event, gestureState) => {

          }}
          onDragRelease={(event, gestureState, bounds) => {
            dragPos.current = gestureState.dx;
            if (gestureState.dx > 80) {
              onStopRecord(true);
              RNVibrationFeedback.vibrateWith(1519);
            }
            else if (gestureState.dx < -80) {
              onStopRecord(false);
              RNVibrationFeedback.vibrateWith(1519);
              setTimeout(() => {
                RNVibrationFeedback.vibrateWith(1519);
              }, 300);
            }
          }}
          onReverse={() => {

          }}

        >
          <View
            onTouchStart={(e) => onChangeRecord(e, true)}
            onTouchEnd={(e) => onChangeRecord(e, false)}
            style={{
              opacity:isPaused?1:0.1
            }}
          >
            <SvgXml
              width={IsExpanded ? 76 : 54}
              height={IsExpanded ? 76 : 54}
              xml={recordSvg}
            />
          </View>
        </Draggable>
      </View>
    </Pressable>
  );
};