import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Vibration,
  Animated
} from 'react-native';
import { useTranslation } from 'react-i18next';
import RNVibrationFeedback from 'react-native-vibration-feedback';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

import '../../language/i18n';
import VoiceService from '../../services/VoiceService';
import { Avatars, windowHeight, windowWidth } from '../../config/config';
import { SemiBoldText } from './SemiBoldText';
import { HeartIcon } from './HeartIcon';
import { DescriptionText } from './DescriptionText';
import { StoryLikes } from './StoryLikes';
import { StoryScreens } from './StoryScreens';
import VoicePlayer from '../Home/VoicePlayer';

import notifySvg from '../../assets/common/whitenotify.svg';
import notificationDisableSvg from '../../assets/record/disable_notification.svg';
import prevSvg from '../../assets/common/prev.svg';
import nextSvg from '../../assets/common/next.svg';
import playSvg from '../../assets/common/play2.svg';
import playgraySvg from '../../assets/common/play2gray.svg';
import greyWaveSvg from '../../assets/record/grey-wave.svg';
import whiteWaveSvg from '../../assets/record/white-wave.svg';
import pauseSvg2 from '../../assets/common/pause2.svg';

export const FriendStoryItem = ({
  props,
  info,
  itemIndex,
  height,
  storyLength,
  onMoveNext = () => {},
  onChangeLike = () => {}
}) => {
  const { t, i18n } = useTranslation();
  const counter = useRef(new Animated.Value(0)).current;
  const counterValue = useRef(0);

  const [showAudio, setShowAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allLikes, setAllLikes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [speed, setSpeed] = useState(1);
  const voiceTitle = info.title;

  const OnSetLike = () => {
    Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
    if (info.isLike == true) {
      VoiceService.recordUnAppreciate(info.id);
    }
    else {
      VoiceService.recordAppreciate({ count: 1, id: info.id });
    }
    onChangeLike(!info.isLike);
  }

  const onSetIsPlaying = (v) => {
    counter.setValue(0);
    counter.stopAnimation(res => {
    });
    if (v == true) {
      onStartProgress(speed);
    }
  }

  const onStartProgress = (v) => {
    let tp = counterValue.current;
    Animated.timing(counter, {
      toValue: 100,
      duration: info.duration * 10 * (100 - tp) / v,
      useNativeDriver: false,
    }).start();
  }

  const onSetSpeed = () => {
    let v = 1;
    if (speed < 2)
      v = speed + 0.5;
    setSpeed(v);
  }

  const progressWidth = counter.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  })

  return (
    <View style={{ width: windowWidth, height: height, flexDirection: "column", alignItems: "center" }}>
      <ImageBackground
        source={info.imgFile ? { uri: info.imgFile.url } : info.user.avatar ? { uri: info.user.avatar.url } : Avatars[info.user.avatarNumber].uri}
        style={{
          flexDirection: "column",
          justifyContent: "flex-end",
          width: windowWidth / 376 * 275,
          height: windowHeight / 815 * 350,
          borderRadius: 10,
        }}
        imageStyle={{
          borderRadius: 10
        }}
        blurRadius={(info.notSafe && isPlayed == false ) ? 20 : 0}
      >
        {(!info.notSafe || isPlayed == true) && <LinearGradient
          style={{ 
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "50%",
            paddingHorizontal: 13,
            borderRadius: 10,
            paddingBottom: 13
           }}
           colors={[ 'rgba(167, 0, 255, 0)', 'rgba(112, 0, 255, 0.7)' ]}
           start={{ x: 0, y: 0 }}
           end={{ x:0, y: 1 }}
        >
          <SemiBoldText
            text={voiceTitle}
            fontSize={20}
            lineHeight={23}
            color='#FFFFFF'
            marginLeft={0}
          />
          <View style={{ marginTop: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "400", fontSize: 13, lineHeight: 16, color: "#FFFFFF" }}>{info.user.name}</Text>
              {info.address != 'null' && info.address && 
                <Text style={{ fontWeight: "400", fontSize: 13, lineHeight: 16, color: "#FFFFFF" }}> - {info.address}</Text>
              }
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: "#FFFFFF"
              }}>
                <Text style={{ fontWeight: "400", fontSize: 11, lineHeight: 14, color: "#DD3FEE" }}>{info.category == "" ? "All" : info.category}</Text>
              </View>
              <View style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: "#FFFFFF",
                marginLeft: 4
              }}>
                <Text style={{ fontWeight: "400", fontSize: 11, lineHeight: 14, color: "#DD3FEE" }}>{info.user.language}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 11, flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <HeartIcon
                isLike={info.isLike}
                height={20}
                OnSetLike={() => OnSetLike()}
                marginLeft={0}
                borderColor={"#FFFFFF"}
              />
              <TouchableOpacity onPress={() => setAllLikes(true)}>
                <DescriptionText
                  text={ info.likesCount }
                  fontSize={14}
                  lineHeight={23}
                  color="#FFFFFF"
                  marginLeft={4}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginLeft: 16 }} onPress={() => setShowChat(true)}>
              <SvgXml
                width={20}
                height={20}
                xml={notifySvg}
              />
              <DescriptionText
                text={ info.answersCount }
                fontSize={14}
                lineHeight={23}
                color="#FFFFFF"
                marginLeft={4}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient> }
        {
          (info.notSafe && isPlayed == false) && <View style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
            backgroundColor: 'rgba(203, 203, 203, 0.54)',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingHorizontal: 14
          }}>
            <View></View>
            <View style={{ 
              alignItems: "center"
            }}>
              <SvgXml
                xml={notificationDisableSvg}
                width={32}
                height={32}
              />
              <SemiBoldText
                text={t("Sensitive content")}
                fontSize={15}
                lineHeight={18}
                color="#000"
                marginTop={15}
              />
              <DescriptionText
                text={t("This audio may not be appropriated")}
                fontSize={11}
                lineHeight={13}
                color="#000"
                marginTop={18}
              />
            </View>
            <View style={{
              width: '100%',
              alignItems: 'center',
              paddingTop: 22,
              borderTopColor: "#1F1F1F",
              borderTopWidth: 1
            }}>
              <TouchableOpacity
                onPress={() => { setIsPlayed(true); setIsPlaying(true); onSetIsPlaying(true) }}
              >
                <SemiBoldText
                  text={t("Play story")}
                  fontSize={14}
                  lineHeight={18}
                  color="#000"
                  marginTop={0}
                  marginBottom={16}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </ImageBackground>
      <View style={{ width: windowWidth / 376 * 275, marginTop: 20 }}>
        <View style={{ width: "100%", borderRadius: 5, height: 6, backgroundColor: "#000" }}>
          <Animated.View style={{
            backgroundColor: "#8E35F6",
            borderRadius: 5,
            height: 6,
            width: progressWidth,
          }} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 5, }}>
          <TouchableOpacity onPress={() => { onMoveNext(itemIndex - 1 >= 0 ? itemIndex - 1 : 0); setIsPlayed(false); setIsPlaying(false); onSetIsPlaying(false) }}>
            <SvgXml
              xml={prevSvg}
              width={18}
              height={18}
            />
          </TouchableOpacity>
          <TouchableOpacity disabled={info.notSafe && !isPlayed} onPress={() => { onSetIsPlaying(!isPlaying); setIsPlaying(!isPlaying); setIsPlayed(false)}}>
            <SvgXml
              xml={ isPlaying ? pauseSvg2 : info.notSafe ? playgraySvg : playSvg}
              width={44}
              height={44}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSetSpeed()}
          >
            <LinearGradient
              style={
                {
                  width: 60,
                  height: 30,
                  borderRadius: 14,
                  borderWidth: speed != 2 ? 0.63 : 0,
                  borderColor: '#D4C9DE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row'
                }
              }
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              colors={speed == 2 ? ['#D89DF4', '#B35CF8', '#8229F4'] : ['#F2F0F5', '#F2F0F5', '#F2F0F5']}
            >
              <SvgXml
                xml={speed == 2 ? whiteWaveSvg : greyWaveSvg}
              />
              <DescriptionText
                text={'x' + speed.toString()}
                fontSize={11}
                lineHeight={18}
                marginLeft={3}
                color={speed == 2 ? '#F6EFFF' : '#361252'}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onMoveNext(itemIndex + 1 >= storyLength ? storyLength - 1 : itemIndex + 1); setIsPlayed(false); setIsPlaying(false); onSetIsPlaying(false) }}>
            <SvgXml
              xml={nextSvg}
              width={18}
              height={18}
            />
          </TouchableOpacity>
        </View>
      </View>
      { isPlaying && <View style={{ width: 1, opacity: 0 }}>
        <VoicePlayer
          voiceUrl={info.file.url}
          playBtn={false}
          waveColor={info.user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
          playing={true}
          startPlay={() => { VoiceService.listenStory(info.id, 'record') }}
          stopPlay={() => {setIsPlaying(false); setIsPlayed(false); onSetIsPlaying(false)}}
          tinWidth={ windowWidth / 376 * 275 / 150}
          mrg={windowWidth / 530}
          duration={info.duration * 1000}
          speed={speed}
        />
      </View>}
      { allLikes && 
        <StoryLikes
          props={props}
          storyId={info.id}
          storyType="record"
          onCloseModal={() => setAllLikes(false)}
        />
      }
      {
        showChat &&
        <StoryScreens
          props={props}
          info={info}
          onCloseModal={() => setShowChat(false)}
        />
      }
    </View>
  )
};