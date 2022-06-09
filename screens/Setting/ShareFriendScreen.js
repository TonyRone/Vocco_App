import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView,  
  TouchableOpacity, 
  Share,
  KeyboardAvoidingView,
} from 'react-native';

import Clipboard from '@react-native-community/clipboard';

import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import socialShare from 'react-native-share';
import giftSvg from '../../assets/setting/gift.svg';
import messageSvg from '../../assets/setting/message.svg';
import messagerSvg from '../../assets/setting/messager.svg';
import whatsappSvg from '../../assets/setting/whatsapp.svg';
import copySvg from '../../assets/setting/copy.svg';
import { windowHeight } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/CommenText';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import VoiceService from '../../services/VoiceService';
import { useSelector } from 'react-redux';

const ShareFriendScreen = (props) => {

    let { user } = useSelector((state) => {
        return (
            state.user
        )
      });

    const {t, i18n} = useTranslation();

    const [password, setPassword] = useState("");
    const [statetype,setStatetype] =useState('current');
    const [referLink, setReferLink] = useState('https://testflight.apple.com/join/ztQ4TQlu')

    const handleSubmit = ()=>{
        if(statetype=='current'){
            setStatetype('match');
            setPassword('');
        }
        if(statetype=='email')
            setStatetype('verify');
    }

    const shareMessage = async()=>{
        const options = {
            title: 'Sharing!',
            message: "hello world"
        };
        const respose = await Share.share(options);
        VoiceService.shareLink();
    }

    const singleShare = async (customOptions) => {
        try {
          await socialShare.shareSingle(customOptions);
        } catch (err) {
          console.log(err);
        }
        VoiceService.shareLink();
    };
    const onCopyLink = ()=>{
        Clipboard.setString(referLink)
    }
    useEffect(() => {
      //  checkLogin();
    }, [])
    return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1,
        }}
      >
        <View style={styles.titleContainer}>
            <TouchableOpacity style ={{position:'absolute',left:16}} onPress={()=>props.navigation.goBack()}>
                <SvgXml
                    width={24}
                    height={24}
                    xml={arrowBendUpLeft}
                />
            </TouchableOpacity>
            <SemiBoldText
                text={t("Share with friends")}
                fontSize={20}
                lineHeight={24}
            />
        </View>
        <View style={{
            marginTop:windowHeight-500,
            marginHorizontal:16,
            alignItems:'center',
            borderRadius:16,
            backgroundColor:'white',
            shadowColor:'rgba(42, 10, 111, 1)',
            shadowOffset:{width: 0, height: 2},
            shadowOpacity:0.5,
            shadowRadius:8,
            elevation:10,
        }}>
            <SvgXml
                width = {24}
                height = {24}
                xml = {giftSvg}
                marginTop = {25}
            />
            <DescriptionText
                text = {t("Refer code")}
                fontSize = {15}
                lineHeight = {24}
                color = 'rgba(54, 36, 68, 0.8)'
            />
            <SemiBoldText
                text = {referLink}
                fontSize = {17}
                lineHeight = {28}
                color = '#8327D8'
                marginTop ={1}
                marginBottom = {24}
            />
        </View>
        <View style={{
            position:'absolute',
            bottom:50,
            paddingHorizontal:19,
            width:'100%'
        }}>
            <SemiBoldText
                text = {t("Share this link")}
                textAlign = 'center'
                fontSize = {17}
                lineHeight = {28}
                marginBottom = {24}
            />
            <View style = {styles.rowSpaceBetween}>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={shareMessage}
                    style={styles.boxContainer}>
                        <SvgXml
                        width={39}
                        height={39}
                        xml = {messageSvg}  
                        />
                    </TouchableOpacity>
                    <DescriptionText
                        text = 'Message'
                        fontSize={11}
                        lineHeight={12}
                        color='#281E30'
                        marginTop={18}
                    />
                </View>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={async () => {
                        await singleShare({
                        title: "Share via message",
                        //message: "some awesome dangerous message",
                        url: referLink,
                        social: socialShare.Social.MESSENGER,
                     //   whatsAppNumber: "9199999999",
                        filename: referLink,
                        });
                    }}
                    style={styles.boxContainer}>
                        <SvgXml
                        width={39}
                        height={39}
                        xml = {messagerSvg}  
                        />
                    </TouchableOpacity>
                    <DescriptionText
                        text = 'Messenger'
                        fontSize={11}
                        lineHeight={12}
                        color='#281E30'
                        marginTop={18}
                    />
                </View>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={async () => {
                        await singleShare({
                        title: "Share via message",
                        message: "some awesome dangerous message",
                        url: referLink,
                        social: socialShare.Social.WHATSAPP,
                        whatsAppNumber: "9199999999",
                        filename: referLink,
                        });
                    }}
                    style={styles.boxContainer}>
                        <SvgXml
                        width={39}
                        height={39}
                        xml = {whatsappSvg}  
                        />
                    </TouchableOpacity>
                    <DescriptionText
                        text = 'WhatsApp'
                        fontSize={11}
                        lineHeight={12}
                        color='#281E30'
                        marginTop={18}
                    />
                </View>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity style={styles.boxContainer} onPress={onCopyLink}>
                        <SvgXml
                        width={39}
                        height={39}
                        xml = {copySvg}  
                        />
                    </TouchableOpacity>
                    <DescriptionText
                        text = {t("Copy link")}
                        fontSize={11}
                        lineHeight={12}
                        color='#281E30'
                        marginTop={18}
                    />
                </View>
            </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default ShareFriendScreen;