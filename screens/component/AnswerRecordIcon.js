
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
import redCancelSvg from '../../assets/post/close.svg';
import publishBlankSvg from '../../assets/post/post.svg';
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
  dem = 44,
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
    await recorderPlayer.resumeRecorder().then(res => {
    })
      .catch(err => {
        console.log(err);
      });
    await recorderPlayer.stopRecorder().then(res => {
    })
      .catch(err => {
        console.log(err);
      });
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
        await recorderPlayer.startRecorder(path, audioSet).then(res => {
        })
          .catch(err => {
            console.log(err);
          });
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
      }
      else {
        clearRecorder();
      }
    }
  };

  const onChangeRecord = async (e, v = false) => {
    if (v == true && isRecording == false) {
        Platform.OS =='ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
        onStartRecord();
    }
    if (v == false && isRecording == true) {
        onStopRecord(dragPos.current >=  - 100 && wasteTime.current > 0)
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
    <View
      style={{
        position: 'absolute',
        bottom: isRecording ? 11 : 22,
        right: isRecording ? 7 : 18,
        width: isRecording ? windowWidth - 48 : 54,
        height: isRecording ? 76 : 54,
      }}
      onPress={() => onStopRecord(false)}
    >
      <View style={{ width: isRecording ? '100%' : 54, height: isRecording ? 76 : 54 }}>
        {isRecording && <View style={{
          width: 328,
          height: 76,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <ImageBackground
            style={{
              position: 'absolute',
              height: 56,
              width: 328,
              justifyContent: 'center'
            }}
            resizeMode="stretch"
            source={require('../../assets/chat/chatRecord.png')}
          >
            <DescriptionText
              text={t("Swipe to Cancel")}
              fontSize={13}
              lineHeight={13}
              color='#E41717'
              marginLeft={188}
            />
          </ImageBackground>
          <View
            style={{
              width: 8,
              height: 8,
              marginLeft: 24,
              borderRadius: 4,
              backgroundColor: "#E41717"
            }}
          ></View>
          <CountdownCircleTimer
            key={key}
            isPlaying={isRecording}
            duration={fill}
            size={57}
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
        </View>}
        <Draggable
          key={key}
          x={isRecording ? windowWidth - 116 : 0}
          y={0}
          shouldReverse={true}
          minX={windowWidth - 250}
          maxX={windowWidth - 50}
          minY={0}
          maxY={0}
          touchableOpacityProps={{
            activeOpactiy: 0.1,
          }}
          onDrag={(event, gestureState) => {

          }}
          onDragRelease={(event, gestureState, bounds) => {
            dragPos.current = gestureState.dx;
            if (gestureState.dx < - 100) {
              setTimeout(() => {
                Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
              }, 100);
              onStopRecord(false);
            }
          }}
          onReverse={() => {

          }}

        >
          <View
            onTouchStart={(e) => onChangeRecord(e, true)}
            onTouchEnd={(e) => onChangeRecord(e, false)}
            style={{
              opacity: isPaused ? 1 : 0.1
            }}
          >
            <SvgXml
              width={isRecording ? 76 : 54}
              height={isRecording ? 76 : 54}
              xml={recordSvg}
            />
          </View>
        </Draggable>
      </View>
    </View>
  );
};