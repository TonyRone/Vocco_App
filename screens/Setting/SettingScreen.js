import React, { useState, useEffect } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  Image, 
} from 'react-native';

import SwipeDownModal from 'react-native-swipe-down';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { DescriptionText } from '../component/DescriptionText';
import { BottomButtons } from '../component/BottomButtons';
import { SearchLanguage } from '../component/SearchLanguage';
import { MyButton } from '../component/MyButton';
import { SvgXml } from 'react-native-svg';
import chewronRightSvg from '../../assets/common/chewron_right.svg';
import termsSvg from '../../assets/setting/terms.svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import referSvg from '../../assets/setting/refer.svg';
import passwordSvg from '../../assets/setting/password.svg';
import contactsSvg from '../../assets/setting/contacts.svg';
import logoutSvg from '../../assets/setting/logout.svg';
import websiteSvg from '../../assets/setting/website.svg';

import {  windowWidth } from '../../config/config';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESSTOKEN_KEY, MAIN_LANGUAGE, windowHeight } from '../../config/config';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import { SettingList } from '../component/SettingList';

import { useSelector } from 'react-redux';

const SettingScreen =  (props) => {

    const user = useSelector((state)=>state.user.user);

    let userData = {...user};

    const [showModal, setShowModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [language, setLanguage] = useState(null);
    const {t, i18n} = useTranslation();

    const OnSelectLanguage = async()=>{
        i18n.changeLanguage(language.language).then(async () => {
            await AsyncStorage.setItem(
                MAIN_LANGUAGE,
                language.language
            );
        })
        .catch(err => console.log(err));
    }

    const renderName = (fname,lname)=>{
        let fullname='';
        if(fname)
            fullname = fname;
        if(lname){
            if(fname) fullname+=' ';
            fullname += lname;
        }
        return fullname
    }
    
    const sendLogOut = async()=>{
        setShowModal(false);
        await AsyncStorage.removeItem(
            ACCESSTOKEN_KEY
        );
        const isSignedIn = await GoogleSignin.isSignedIn();
        if(isSignedIn)
            await GoogleSignin.signOut();
        props.navigation.navigate('Welcome');
    }

    useEffect(() => {
      //  checkLogin();
      GoogleSignin.configure({
        androidClientId: '411872622691-jtn0id6ql8ugta4i8qo962tngerf79vl.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        iosClientId:'1034099036541-va0ioishaoaueb7elaogc2ra1h4u1if3.apps.googleusercontent.com'
    });
    }, [])
    return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <CommenText
            text={t("Settings")}
            fontSize={20}
            lineHeight={24}
            textAlign='center'
            marginTop={10}
        />
        <View style={{marginTop:14}}>
            <TouchableOpacity onPress={()=>props.navigation.navigate('EditProfile')} style={[styles.rowSpaceBetween,{paddingVertical:16,marginHorizontal:16,borderBottomWidth:1,borderBottomColor:'#F2F0F5'}]}>
                <View style={styles.rowAlignItems}>
                    <Image
                        style={{
                           width:56,
                           height:56,
                           borderRadius:28,
                           marginRight:16
                        }}
                        source={{uri:userData.avatar.url}}
                    />
                    <View>
                        <CommenText
                            text={userData.name}
                            fontSize={17}
                            lineHeight={28}
                        />
                        <DescriptionText
                            text={renderName(userData.firstname,userData.lastname)}
                            fontSize={13}
                            lineHeight={21}
                        />
                    </View>
                </View>
                <SvgXml
                    width={24}
                    height={24}
                    xml = {chewronRightSvg}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>props.navigation.navigate('Premium')} style={[styles.rowSpaceBetween,{paddingVertical:16,paddingHorizontal:16, backgroundColor:'rgba(255, 247, 232, 1)'}]}>
                <View style={styles.rowAlignItems}>
                    <Image 
                        source={require('../../assets/setting/premium_icon.png')} 
                        style={{
                            width:40,
                            height:40
                        }}
                    />
                    <CommenText
                        text={t("Upgrade to Premium")}
                        fontSize={17}
                        lineHeight={28}
                        color='rgba(243, 171, 0, 1)'
                        marginLeft={16}
                    />
                </View>
                <SvgXml
                    width={24}
                    height={24}
                    xml = {chewronRightSvg}
                />
            </TouchableOpacity>
            <View style={{marginHorizontal:16,width:windowWidth-32,height:1,backgroundColor:'rgba(242, 240, 245, 1)'}}>
            </View>
            <SettingList
                svgRoute= {passwordSvg}
                svgRight = {chewronRightSvg}
                titleContent = {t("Change password")}
                onPressList = {()=>props.navigation.navigate('ChangePassword')}
            />
            <SettingList
                svgRoute= {referSvg}
                svgRight = {chewronRightSvg}
                titleContent = {t("Refer to a Friend")}
                onPressList = {()=>props.navigation.navigate('ShareFriend')}
            />
            <SettingList
                svgRoute= {termsSvg}
                svgRight = {chewronRightSvg}
                titleContent = {t("Terms and Conditions")}
               // onPressList = {()=>props.navigation.navigate('ChangePassword')}
            />
            <SettingList
                svgRoute= {contactsSvg}
                svgRight = {chewronRightSvg}
                titleContent = {t("Contacts")}
                onPressList = {()=>props.navigation.navigate('Contact')}
            />
            <SettingList
                svgRoute= {websiteSvg}
                svgRight = {chewronRightSvg}
                titleContent = {t("Language")}
                onPressList = {()=>setShowLanguageModal(true)}
            />
            <SettingList
                svgRoute = {logoutSvg}
                rightCheck = {false} 
                titleContent = {t("Logout")}
                onPressList = {()=>setShowModal(true)}
            />
        </View>
        <BottomButtons
            active = 'settings'
            props={props}
        />
        <SwipeDownModal
          modalVisible={showModal}
          ContentModal={
            <View style={{
              marginTop:300,
              width:windowWidth-48,
              height:181,
              marginHorizontal:24,
              borderRadius:24,
              backgroundColor:'white',
              shadowColor:'rgba(1, 1, 19, 0.5)',
              shadowOffset:{width: 0, height: 2},
                shadowOpacity:0.5,
                shadowRadius:8,
              elevation:1
            }}>
                <CommenText
                    text={t("Log out?")}
                    fontSize={20}
                    lineHeight={24}
                    marginTop={35}
                    marginLeft={24}
                />
                <DescriptionText
                    text={t("Are you sure you want to log out?")}
                    fontSize={15}
                    lineHeight={24}
                    color='rgba(54, 36, 68, 0.8)'
                    marginTop={13}
                    marginLeft={24}
                />
                <View style={{flexDirection:'row',marginTop:27,marginLeft:windowWidth/2-38}}>
                    <TouchableOpacity onPress={()=>setShowModal(false)}>
                        <CommenText
                            text={t("Cancel")}
                            fontSize={15}
                            lineHeight={24}
                            color='#E41717'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>sendLogOut()}>
                        <CommenText
                            text={t("Send")}
                            fontSize={15}
                            lineHeight={24}
                            color='#8327D8'
                            marginLeft={56}
                        />
                    </TouchableOpacity>
                </View>
            </View>
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setShowModal(false)}}
          onClose={() => {
              setShowModal(false);
          }}
        />
        <SwipeDownModal
          modalVisible={showLanguageModal}
          ContentModal={
            <View style={styles.swipeInputContainerContent}>
                <View style={[styles.rowSpaceBetween,{paddingHorizontal:14,paddingVertical:12}]}>
                    <TouchableOpacity onPress={()=>setShowLanguageModal(false)}>
                        <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                            <SvgXml
                                width={18}
                                height={18}
                                xml={closeBlackSvg}
                                />
                        </View>
                    </TouchableOpacity>
                    <CommenText
                        text={t("Select your language")}
                        fontSize={17}
                        lineHeight={28}
                        color='#263449'
                    />
                    <TouchableOpacity disabled={!language} onPress={()=>OnSelectLanguage(language)}>
                        <DescriptionText
                            text={t('Save')}
                            fontSize={17}
                            lineHeight={28}
                            color='#8327D8'
                        />
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal:16,marginTop:16}}>
                    <SearchLanguage
                        height = {windowHeight-190}
                        onSelectLanguage={(lge)=>setLanguage(lge)}
                    />
                </View>
                <LinearGradient
                    colors={['#FFFFFF', 'rgba(255,255,255, 0)']}
                    locations={[0.7,1]}
                    start={{x: 0, y: 1}} end={{x: 0, y: 0}}
                    style={{position:'absolute',paddingHorizontal:16, bottom:0,width:windowWidth,height:170}}
                >
                    <MyButton
                        label={t("Save")}
                        marginTop={60}
                        onPress={()=>{OnSelectLanguage();setShowLanguageModal(false);}}
                        active={language ? true : false}
                        //marginBottom={20}
                    />
                </LinearGradient>
            </View>
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setShowLanguageModal(false)}}
          onClose={() => {
              setShowLanguageModal(false);
          }}
        />
      </KeyboardAvoidingView>
    );
  };
  
  export default SettingScreen;