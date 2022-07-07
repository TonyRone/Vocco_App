
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
} from 'react-native';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import RNVibrationFeedback from 'react-native-vibration-feedback';
import RNFetchBlob from 'rn-fetch-blob';
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
import { styles } from '../style/Common';

export const AnswerRecordIcon = ({
  props,
  dem = 54,
  bottom,
  left,
}) => {


  let { user, voiceState, refreshState } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  let recordId = props.navigation.state.params?.id;
  const [fill, setFill] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [key, setKey] = useState(0);
  const [hoverState, setHoverState] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [IsExpanded, setIsExpanded] = useState(false);
  const [expand, setExpand] = useState(0);

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
        props.navigation.navigate('PostingAnswerVoice', { id: recordId, recordSecs: Math.ceil(tp / 1000.0) })
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
    //dispatch(setVoiceState(voiceState+1));
    return () => clearRecorder();
  }, [])

  return (
    <Pressable
      style={{
        position: 'absolute',
        bottom: IsExpanded ? 0 : bottom,
        left: IsExpanded ? 0 : left,
        width: IsExpanded ? '100%' : dem,
        height: IsExpanded ? '100%' : dem,
        elevation: 11
      }}
      onPress={() => onStopRecord(false)}
    >
      {IsExpanded &&
        <Pressable onPressOut={() => onStopRecord(false)} style={[styles.swipeModal, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
          <>
            <Image
              style={{
                position: 'absolute',
                bottom: 20,
                height: 56,
                width: 281.22,
                right: (windowWidth - 281.22) / 2
              }}
              resizeMode="stretch"
              source={require('../../assets/post/answerReply.png')}
            />
            <View style={{
              position: 'absolute',
              bottom: 160,
              right: (windowWidth - 105) / 2,
              width: 105,
              height: 48,
              backgroundColor: "#FFF",
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#E41717"
                }}
              >
              </View>
              <CountdownCircleTimer
                key={key}
                isPlaying={!isPaused}
                duration={fill}
                size={70}
                strokeWidth={0}
                trailColor="#D4C9DE"
                trailStrokeWidth={0}
                onComplete={() => onStopRecord(true)}
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
          </>
        </Pressable>
      }
      <View style={{ position: IsExpanded ? 'absolute' : 'relative', bottom: '6%', width: IsExpanded ? '100%' : 54, height: IsExpanded ? 76 : 54 }}>
        <Draggable
          key={key}
          x={IsExpanded ? windowWidth / 2 - 38 : 0}
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