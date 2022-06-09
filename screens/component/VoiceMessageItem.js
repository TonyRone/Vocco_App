import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
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

export const VoiceMessageItem = ({
  props,
  info,
}) => {

  const { user } = useSelector((state) => state.user);

  const [isPlaying, setIsPlaying] = useState(false);

  const { t, i18n } = useTranslation();

  const isSender = (user.id == info.user.id);

  let num = Math.ceil((new Date().getTime() - new Date(info.createdAt).getTime()) / 60000), minute = num % 60;

  return (
    <View style={{ flexDirection: 'row', justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
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
            marginTop: 8
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
          height={25}
          startPlay={() => { }}
          stopPlay={() => { }}
          tinWidth={windowWidth / 300}
          mrg={windowWidth / 730}
          duration={info.duration * 1000}
        />
        <View style={[styles.rowSpaceBetween,{paddingLeft:16,paddingRight:8, marginTop:6}]}>
          <DescriptionText
            text={new Date(info.duration*1000).toISOString().substr(14, 5)}
            lineHeight={12}
            fontSize={11}
            color={isSender?'#FFF':'rgba(59, 31, 82, 0.6)'}
          />
          <DescriptionText
            text={new Date(info.createdAt).toISOString().substr(11, 5)}
            lineHeight={12}
            fontSize={11}
            color={isSender?'#FFF':'rgba(59, 31, 82, 0.6)'}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
