import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Vibration
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { NavigationActions, StackActions } from 'react-navigation';
import { TitleText } from '../component/TitleText';
import { ShareHint } from '../component/ShareHint';
import { ShareVoice } from '../component/ShareVoice';

import { MyButton } from '../component/MyButton';
import { ReactionEmojies } from '../component/ReactionEmojies';

import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, windowWidth, } from '../../config/config';
import VoiceService from '../../services/VoiceService';
import VoicePlayer from '../Home/VoicePlayer';
import { setRefreshState } from '../../store/actions';
import { useSelector , useDispatch} from 'react-redux';

const PostingAnswerVoiceScreen = (props) => {

  let info = props.navigation.state.params.info;

  let { user , refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const {t, i18n} = useTranslation();

  const [playStatus, setPlayStatus] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(props.navigation.state.params?.recordSecs ? props.navigation.state.params?.recordSecs : 0);
  const [isLoading,setIsLoading] = useState(false);
  const [icon, setIcon] = useState("😁");
  const [visibleReaction, setVisibleReaction] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShareVoice, setShowShareVoice] = useState(false);

  const dispatch = useDispatch();

  const dirs = RNFetchBlob.fs.dirs;

  const path = Platform.select({
    ios: `${dirs.CacheDir}/hello.m4a`,
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  const onNavigate = (des, par = null) =>{
    //props.navigation.navigate(navigateScreen,{info:jsonRes})
    const resetActionTrue = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: des, params:par })],
    });
    props.navigation.dispatch(resetActionTrue);
  }

  const selectIcon = (icon) => {
    setIcon(icon);
    setVisibleReaction(false);
  }

  const handleSubmit = async () => {
    const post_check = await AsyncStorage.getItem(POST_CHECK);
    if (!post_check){
      setShowHint(true);
      return ;
    }
    setPlayStatus(false);
    setIsLoading(true);
    if (path) {
      let voiceFile = [
        { name:'duaration', data:String(displayDuration) },
        { name:'record', data:info.id },
        { name:'emoji', data:String(icon) },
        {name: 'file', filename:Platform.OS==='android'?'hello.mp3':'hello.m4a', data: RNFetchBlob.wrap(String(path))},
      ] ;
      VoiceService.postAnswerVoice(voiceFile).then(async res => { 
        const jsonRes = await res.json();
        if (res.respInfo.status !== 201) {
        } else {
          Vibration.vibrate(100);
          dispatch(setRefreshState(!refreshState));
          setShowShareVoice(jsonRes);
        }
        setIsLoading(false);
      })
      .catch(err => {
          console.log(err);
      });
    }
  }

  useEffect(() => {
    //  checkLogin();
  }, [])
  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
      }}
    >
      <View style={{ width: windowWidth}}>
        <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          <Pressable style={{ 
            marginLeft: 16,
            position:'absolute',
            left:0
          }} onPress={() => props.navigation.goBack()}>
            <SvgXml width="24" height="24" xml={closeBlackSvg} />
          </Pressable>

          <TitleText
            text={t("Your answer")}
            fontSize={20}
            lineHeight={24}
          />
        </View>
      </View>
      <View style={{ alignItems: 'center', marginTop: 150 }}>
        {/* <TouchableOpacity onPress={() => setVisibleReaction(true)} style={[{ width: 80, height: 80, backgroundColor: '#FFFFFF', borderRadius: 40 }, styles.contentCenter]}>
          <Text
            style={{
              fontSize: 45,
              color: 'white',
            }}
          >
            {icon}
          </Text>

          <View style={[styles.contentCenter, { position: 'absolute', height: 24, width: 24, borderRadius: 12, bottom: 0, right: 0, backgroundColor: '#8327D8' }]}>
            <View>
              <SvgXml
                width={16}
                height={16}
                xml={editSvg}
              />
            </View>
          </View>
        </TouchableOpacity> */}
        <TitleText
          text={`${t("Duration")}: ${displayDuration} ${t("seconds")}`}
          fontFamily="SFProDisplay-Regular"
          fontSize={15}
          lineHeight={24}
          marginTop={7}
          color="rgba(54, 36, 68, 0.8)"
        />
      </View>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 16,
          backgroundColor: '#FFF',
          shadowColor: 'rgba(176, 148, 235, 1)',
          shadowOffset:{width: 0, height: 2},
          shadowOpacity:0.5,
          shadowRadius:8,
          elevation: 10,
          borderRadius: 16,
          marginHorizontal: 20,
          marginTop:30
        }}
      >
        <VoicePlayer
          playBtn = {true}
          replayBtn = {true}
          premium = {user.premium!='none'}
          playing = {false}
          stopPlay = {()=>{}}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
          position:'absolute',
          bottom: 40
        }}
      >
        <MyButton
          label={t("Post my answer")}
          loading={isLoading}
          onPress={handleSubmit}
        />
      </View>
      {visibleReaction && 
      <ReactionEmojies
        onSelectIcon ={(icon)=>selectIcon(icon)}   
        onCloseModal ={()=>setVisibleReaction(false)}
      />}
      {showHint&&
      <ShareHint
        onCloseModal={()=>{setShowHint(false);handleSubmit();}}
      />}
      {showShareVoice&&
      <ShareVoice
        info = {{file:{url:showShareVoice.file.url}, title:'answer voice'}}
        onCloseModal={()=>{setShowShareVoice(false);props.navigation.navigate("VoiceProfile",{info:info});}}
      />}
    </KeyboardAvoidingView>
  );
};

export default PostingAnswerVoiceScreen;