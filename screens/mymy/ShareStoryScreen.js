import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  Vibration
} from 'react-native';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { DescriptionText } from '../component/DescriptionText';
import { NavigationActions, StackActions } from 'react-navigation';
import copySvg from '../../assets/post/copy.svg';
import Clipboard from '@react-native-community/clipboard';
import socialShare from 'react-native-share';
import { MyButton } from '../component/MyButton';
import { ShareVoice } from '../component/ShareVoice';
import { SvgXml } from 'react-native-svg';
import shareTextSvg from '../../assets/post/ShareText.svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHARE_CHECK, windowWidth } from '../../config/config';
import { styles } from '../style/Login';
import { TitleText } from '../component/TitleText';
import { ScrollView } from 'react-native-gesture-handler';
import VoiceService from '../../services/VoiceService';
import RNVibrationFeedback from 'react-native-vibration-feedback';

const ShareStoryScreen = (props) => {

  let info = props.navigation.state.params?.info;

  const { t, i18n } = useTranslation();

  const singleShare = async (customOptions) => {
    try {
      await socialShare.shareSingle(customOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const onCopyLink = () => {
    Clipboard.setString(info.file.url);
  }

  const onNavigate = (des, par = null) => {
    const resetActionTrue = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: des, params: par })],
    });
    props.navigation.dispatch(resetActionTrue);
  }

  useEffect(() => {

  }, [])

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <ScrollView>
        <Image
          style={{
            width: windowWidth,
            //marginTop: -65,
            borderColor: '#000',
          }}
          source={require("../../assets/post/whooo.png")}
        />
        <TitleText
          text={t("Whoooooo!") + '\n' + t("Your story is published!")}
          fontSize={28}
          lineHeight={33}
          marginTop={-95}
          textAlign='center'
        />
        <View
          style={{ alignItems: 'center' }}
        >
          <DescriptionText
            text={t("Share your new story with your friends and let the whole world hear you!")}
            fontSize={15}
            lineHeight={24}
            textAlign='center'
            marginTop={12}
            maxWidth={264}
          />
        </View>
        <View
          style={{
            marginTop: 24,
            marginBottom: 90,
            width: '100%',
            paddingHorizontal: 24
          }}
        >
          <View style={styles.rowSpaceBetween}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={async () => {
                await singleShare({
                  title: "Share via message",
                  message: "some awesome dangerous message",
                  url: info.file.url,
                  social: socialShare.Social.SNAPCHAT,
                  filename: info.title,
                });
                VoiceService.shareStory(info.id, 'record');
              }}>
                <Image
                  style={{
                    width: 58,
                    height: 58
                  }}
                  source={require('../../assets/post/Logo-snap.jpg')}
                />
              </TouchableOpacity>
              <DescriptionText
                text='Snapchat'
                fontSize={12}
                lineHeight={16}
                color='rgba(54, 36, 68, 0.8)'
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={async () => {
                await singleShare({
                  title: "Share via message",
                  message: "some awesome dangerous message",
                  url: info.file.url,
                  social: 'tiktok',
                  filename: info.title,
                });
                VoiceService.shareStory(info.id, 'record');
              }}>
                <Image
                  style={{
                    width: 58,
                    height: 58
                  }}
                  source={require('../../assets/post/Logo-tiktok.jpg')}
                />
              </TouchableOpacity>
              <DescriptionText
                text='TikTok'
                fontSize={12}
                lineHeight={16}
                color='rgba(54, 36, 68, 0.8)'
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={async () => {
                await singleShare({
                  title: "Share via message",
                  message: "some awesome dangerous message",
                  url: info.file.url,
                  backgroundImage: 'https://source.unsplash.com/daily',
                  social: socialShare.Social.INSTAGRAM_STORIES,
                  filename: info.title,
                });
                VoiceService.shareStory(info.id, 'record');
              }}>
                <Image
                  style={{
                    width: 58,
                    height: 58
                  }}
                  source={require('../../assets/post/Logo-instagram.jpg')}
                />
              </TouchableOpacity>
              <DescriptionText
                text='Instagram'
                fontSize={12}
                lineHeight={16}
                color='rgba(54, 36, 68, 0.8)'
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={async () => {
                await singleShare({
                  title: "Share via message",
                  message: "some awesome dangerous message",
                  whatsAppNumber: "9199999999",
                  url: info.file.url,
                  social: socialShare.Social.WHATSAPP,
                  filename: info.title,
                });
                VoiceService.shareStory(info.id, 'record');
              }}>
                <Image
                  style={{
                    width: 58,
                    height: 58
                  }}
                  source={require('../../assets/post/Logo-whatsapp.jpg')}
                />
              </TouchableOpacity>
              <DescriptionText
                text='WhatsApp'
                fontSize={12}
                lineHeight={16}
                color='rgba(54, 36, 68, 0.8)'
              />
            </View>
          </View>
          <DescriptionText
            text={t("Share Link") + ":"}
            marginTop={24}
            color="#281E30"
            fontSize={17}
            lineHeight={28}
          />
          <View style={[styles.rowSpaceBetween, { width: '100%', height: 40, marginTop: 8, borderWidth: 1, borderColor: '#F2F0F5', borderRadius: 12 }]}>
            <View style={{ width: windowWidth - 115, height: 26 }}>
              <DescriptionText
                text={info.file.url}
                color="#281E30"
                fontSize={22}
                lineHeight={26}
                marginLeft={12}
              />
            </View>
            <TouchableOpacity onPress={onCopyLink}>
              <SvgXml
                width={24}
                height={24}
                marginRight={10}
                xml={copySvg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ position: 'absolute', left: 16, top: 20 }} onPress={() => { onNavigate("Home"); RNVibrationFeedback.vibrateWith(1519); }}>
          <SvgXml width="24" height="24" xml={closeBlackSvg} />
        </TouchableOpacity>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
          position: 'absolute',
          bottom: 20
        }}
      >
        <MyButton
          label={t("Bring me to the feed!")}
          onPress={() => onNavigate("Home")}
        />
      </View>
    </SafeAreaView>
  );
};

export default ShareStoryScreen;