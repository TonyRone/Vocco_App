import React, {useState} from "react";
import { View, TouchableOpacity, Text, Image, Platform,Share, StatusBar, Pressable,ScrollView } from "react-native";
import { SvgXml } from 'react-native-svg';

import {API_URL, windowWidth} from '../../config/config';

import { TitleText } from './TitleText';
import SwipeDownModal from 'react-native-swipe-down';
import Clipboard from '@react-native-community/clipboard';
import socialShare from 'react-native-share';
import { styles } from '../style/Common';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import copySvg from '../../assets/post/copy.svg';
import { SemiBoldText } from "./CommenText";
import { DescriptionText } from "./DescriptionText";

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import VoiceService from "../../services/VoiceService";

export const ShareVoice = ({
  onCloseModal=()=>{},
  info = {file:{url:'https://storage.googleapis.com/'}, title:'Hello'}
}) => {

  const {t, i18n} = useTranslation();

  const [showModal,setShowModal] = useState(true);

  const closeModal = ()=>{
    setShowModal(false);
    onCloseModal();
  }

  const singleShare = async (customOptions) => {
    try {
      await socialShare.shareSingle(customOptions);
    } catch (err) {
      console.log(err);
    }
  };

  const onCopyLink = ()=>{
    Clipboard.setString(info.file.url);
  }

  return (
    <SwipeDownModal
      modalVisible={showModal}
      ContentModal={
        <View
          style={{
            position:'absolute',
            bottom:25,
            width:'100%',
            paddingHorizontal:14,
            flex:1,
            alignItems:'center'
          }}
        >
          <View
            style={{
              borderRadius:24,
              width:'100%',
              height:281,
              backgroundColor: 'white',
              shadowColor:'rgba(42, 10, 111, 1)',
              shadowOffset:{width: 0, height: 2},
              shadowOpacity:0.5,
              shadowRadius:8,
              elevation:10,
              paddingHorizontal:24
            }}
          >
            <View style={[styles.rowSpaceBetween,{marginTop:16,marginBottom:24}]}>
              <DescriptionText
                text={t("Share with a friend")}
                color="#281E30"
                fontSize={17}
                lineHeight={28}
              />
              <TouchableOpacity onPress={closeModal} style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                <View>
                  <SvgXml
                    width={18}
                    height={18}
                    xml={closeBlackSvg}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style = {styles.rowSpaceBetween}>
              <View style={{alignItems:'center'}}>
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
                      width:58,
                      height:58
                    }}
                    source={require('../../assets/post/Logo-snap.jpg')} 
                  />
                </TouchableOpacity>
                <DescriptionText
                    text = 'Snapchat'
                    fontSize={12}
                    lineHeight={16}
                    color='rgba(54, 36, 68, 0.8)'
                />
              </View>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{
                   VoiceService.shareStory(info.id, 'record');
                }}>
                  <Image
                    style={{
                      width:58,
                      height:58
                    }}
                    source={require('../../assets/post/Logo-tiktok.jpg')} 
                  />
                </TouchableOpacity>
                <DescriptionText
                    text = 'TikTok'
                    fontSize={12}
                    lineHeight={16}
                    color='rgba(54, 36, 68, 0.8)'
                />
              </View>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={async () => {
                    await singleShare({
                    title: "Share via message",
                    message: "some awesome dangerous message",
                    url: info.file.url,
                    backgroundImage:'https://source.unsplash.com/daily',
                    social: socialShare.Social.INSTAGRAM_STORIES,
                    filename: info.title,
                    });
                    VoiceService.shareStory(info.id, 'record');
                }}>
                    <Image
                      style={{
                        width:58,
                        height:58
                      }}
                      source={require('../../assets/post/Logo-instagram.jpg')} 
                    />
                </TouchableOpacity>
                <DescriptionText
                    text = 'Instagram'
                    fontSize={12}
                    lineHeight={16}
                    color='rgba(54, 36, 68, 0.8)'
                />
              </View>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={async () => {
                    await singleShare({
                    title: "Share via message",
                    message: "some awesome dangerous message",
                    url: info.file.url,
                    social: socialShare.Social.WHATSAPP,
                    filename: info.title,
                    });
                    VoiceService.shareStory(info.id, 'record');
                }}>
                  <Image
                    style={{
                      width:58,
                      height:58
                    }}
                    source={require('../../assets/post/Logo-whatsapp.jpg')} 
                  />
                </TouchableOpacity>
                <DescriptionText
                    text = 'WhatsApp'
                    fontSize={12}
                    lineHeight={16}
                    color='rgba(54, 36, 68, 0.8)'
                />
              </View>
            </View>
            <View style={{backgroundColor:'#F2F0F5', height:1,width:'100%', marginTop:20,marginBottom:16}}></View>
            <DescriptionText
              text='Post Link:'
              color="#281E30"
              fontSize={17}
              lineHeight={28}
            />
            <View style={[styles.rowSpaceBetween,{width:'100%',height:40,marginTop:8,borderWidth:1,borderColor:'#F2F0F5',borderRadius:12}]}>
              <View style={{width:windowWidth-115, height:26}}>
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
        </View>
      }
      ContentModalStyle={styles.swipeModal}
      onRequestClose={() => closeModal()}
      onClose={() => 
          closeModal()
      }
    />
  );
};
