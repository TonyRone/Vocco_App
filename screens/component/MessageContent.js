import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView, Pressable } from "react-native";
import AutoHeightImage from 'react-native-auto-height-image';
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { HeartIcon } from './HeartIcon';
import { StoryLikes } from "./StoryLikes";
import whiteTrashSvg from '../../assets/notification/white_trash.svg'
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import blankHeartSvg from '../../assets/post/blankHeart.svg';
import redHeartSvg from '../../assets/post/redHeart.svg';
import notifySvg from '../../assets/common/notify.svg';
import curveSvg from '../../assets/record/curve.svg';
import { styles } from '../style/Common';
import { SemiBoldText } from "./CommenText";
import { createIconSetFromFontello } from "react-native-vector-icons";
import VoicePlayer from '../Home/VoicePlayer';
import VoiceService from "../../services/VoiceService";
import { windowWidth } from "../../config/config";

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import LinearGradient from "react-native-linear-gradient";
import { MessageContext } from "./MessageContext";

export const MessageContent = ({
  info,
  isAnswer = false
}) => {

  const { user } = useSelector((state) => state.user);

  const { t, i18n } = useTranslation();

  const isSender = (user.id == info.user.id);

  return (
    info.type == 'voice' ?
      <LinearGradient
        style={
          {
            padding: 8,
            paddingRight: 8,
            paddingLeft: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderTopLeftRadius: isSender ? 16 : 8,
            borderTopRightRadius: isSender ? 8 : 16,
          }
        }
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        colors={isSender ? ['#D89DF4', '#B35CF8', '#8229F4'] : ['#FFF', '#FFF', '#FFF']}
      >
        <VoicePlayer
          voiceUrl={info?.file.url}
          playBtn={true}
          waveColor={['#E4CAFC', '#E4CAFC', '#E4CAFC']}
          playing={false}
          height={isAnswer ? 20 : 25}
          playBtnSize={isAnswer ? 12 : 10}
          startPlay={() => { }}
          stopPlay={() => { }}
          tinWidth={windowWidth / (isAnswer ? 350 : 300)}
          mrg={windowWidth / (isAnswer ? 850 : 730)}
          duration={info.duration * 1000}
        />
        <View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 8, marginTop: 6 }]}>
          <DescriptionText
            text={new Date(info.duration * 1000).toISOString().substr(14, 5)}
            lineHeight={12}
            fontSize={11}
            color={isSender ? '#FFF' : 'rgba(59, 31, 82, 0.6)'}
          />
          <DescriptionText
            text={new Date(info.createdAt).toISOString().substr(11, 5)}
            lineHeight={12}
            fontSize={11}
            color={isSender ? '#FFF' : 'rgba(59, 31, 82, 0.6)'}
          />
        </View>
      </LinearGradient>
      :
      <View>
        <AutoHeightImage
          source={{ uri: info.file.url }}
          width={199}
          style={{
            borderRadius: 20,
            borderWidth: 4,
            borderColor: '#FFF'
          }}
        />
        <View style={{
          position:'absolute',
          bottom:4,
          right:4,
          padding:8,
          borderRadius:14,
          backgroundColor:'rgba(54, 36, 68, 0.8)'
        }}>
          <DescriptionText
            text={new Date(info.createdAt).toISOString().substr(11, 5)}
            lineHeight={12}
            fontSize={11}
            color='#F6EFFF'
          />
        </View>
      </View>
  );
};
