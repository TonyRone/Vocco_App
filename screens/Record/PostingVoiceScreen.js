import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Vibration
} from 'react-native';

import { useSelector } from 'react-redux';

import RNFetchBlob from 'rn-fetch-blob';
import { NavigationActions, StackActions } from 'react-navigation';
import { TitleText } from '../component/TitleText';

import { CategoryIcon } from '../component/CategoryIcon';
import { MyButton } from '../component/MyButton';
import { ReactionEmojies } from '../component/ReactionEmojies';
import { ShareHint } from '../component/ShareHint';
import { ShareVoice } from '../component/ShareVoice';

import SwipeDownModal from 'react-native-swipe-down';
import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import yesSwitchSvg from '../../assets/common/yesSwitch.svg';
import noSwitchSvg from '../../assets/common/noSwitch.svg';
import editSvg from '../../assets/record/edit.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, Categories,windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { AllCategory } from '../component/AllCategory';
import VoiceService from '../../services/VoiceService';
import VoicePlayer from "../Home/VoicePlayer";


const PostingVoiceScreen = (props) => {

  let displayDuration = props.navigation.state.params?.recordSecs ? props.navigation.state.params?.recordSecs : 0;
  let isTemporary = props.navigation.state.params?.isTemporary?true:false;

  let { user, socketInstance } = useSelector((state) => state.user);

  const [category, setCategory] = useState(0);
  const [visibleStatus, setVisibleStatus] = useState( isTemporary);
  const [temporaryStatus, setTemporaryStatus] = useState(isTemporary);
  const [visibleReaction, setVisibleReaction] = useState(false);
  const [icon, setIcon] = useState("😁");
  const [voiceTitle, setVoiceTitle] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShareVoice, setShowShareVoice] = useState(null);

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
    if (path) {
      let voiceFile = [
        {
          name: 'file', filename: Platform.OS==='android'?'hello.mp3':'hello.m4a', data: RNFetchBlob.wrap(path)
        },
        { name:'title', data:voiceTitle },
        { name:'emoji', data:String(icon) },
        { name:'duration', data:String(displayDuration) },
        { name:'category', data:Categories[category].label },
        { name:'privacy', data:String(visibleStatus) },
        { name:'temporary', data:String(temporaryStatus) }
      ] ;
      setIsLoading(true);
      VoiceService.postVoice(voiceFile).then(async res => { 
        const jsonRes = await res.json();
        if (res.respInfo.status !== 201) {
        } else {
<<<<<<< HEAD
          Vibration.vibrate(100);
=======
          Vibration.vibrate(200);
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
          socketInstance.emit("newVoice", {uid:user.id});
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
        flex: 1
      }}
    >
      <View style={{ width: windowWidth, height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#F8F0FF' }}>
        <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          <Pressable style={{ 
            marginLeft: 16,
            position:'absolute',
            left:0
          }} onPress={() => props.navigation.goBack()}>
            <SvgXml width="24" height="24" xml={closeBlackSvg} />
          </Pressable>

          <TitleText
            text="Posting voice"
            fontSize={20}
            lineHeight={24}
          />
        </View>
        <View style={{ alignItems: 'center', marginTop: 41 }}>
          <TouchableOpacity onPress={() => setVisibleReaction(true)} style={[{ width: 80, height: 80, backgroundColor: '#FFFFFF', borderRadius: 40 }, styles.contentCenter]}>
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
          </TouchableOpacity>
          <TextInput
            placeholder='Your title (3 words max)'
            placeholderTextColor="#3B1F5290"
            color="#281E30"
            value={voiceTitle}
            onChangeText={(s)=>s.length<=20?setVoiceTitle(s):null}
            fontFamily="SFProDisplay-Regular"
            fontSize={28}
            lineHeight={34}
            marginTop={5}
            letterSpaceing={5}
          />
          <TitleText
            text={`Duration: ${displayDuration} seconds`}
            fontFamily="SFProDisplay-Regular"
            fontSize={15}
            lineHeight={24}
            marginTop={7}
            color="rgba(54, 36, 68, 0.8)"
          />
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            marginTop: 24,
            paddingHorizontal: 8,
            paddingVertical: 16,
            backgroundColor: '#FFF',
            shadowColor: 'rgba(176, 148, 235, 1)',
            shadowOffset:{width: 0, height: 2},
            shadowOpacity:0.5,
            shadowRadius:8,
            elevation: 10,
            borderRadius: 16,
            marginHorizontal: 16,
          }}
        >
          <VoicePlayer
            playBtn = {true}
            replayBtn = {true}
            playing = {false}
            stopPlay = {()=>{}}
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TitleText
            text='Select category'
            fontFamily="SFProDisplay-Regular"
            fontSize={15}
            lineHeight={24}
            marginTop={26}
            marginLeft={16}
            marginBottom={9}
            color="rgba(54, 36, 68, 0.8)"
          />
          <TouchableOpacity onPress={() => {
                setShowModal(true);
          }}>
            <TitleText
              text='SEE ALL'
              fontFamily="SFProDisplay-Regular"
              fontSize={15}
              lineHeight={24}
              marginTop={26}
              marginRight={16}
              marginBottom={9}
              color="rgba(54, 36, 68, 0.8)"
            />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{marginLeft:12},styles.mt16]}>
          {Categories.map((item,index)=>{
            var temp_item, id = index;
            // if(category > 4) id = index-1;
            // if(id < 0) id = category;
            temp_item = Categories[id];
            return(
              <CategoryIcon 
                key = {'catagory'+index}
                label={temp_item.label}
                source={temp_item.uri}
                onPress={()=>setCategory(id)}
                active={category == id ? true : false}
              />
            )
          })}
        </ScrollView>
        <TitleText
          text='Privacy settings'
          fontFamily="SFProDisplay-Regular"
          fontSize={15}
          lineHeight={24}
          marginTop={20}
          marginLeft={16}
          marginBottom={9}
          color="rgba(54, 36, 68, 0.8)"
        />
        <View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 12, marginBottom: visibleStatus?5:50 }]}>
          <TitleText
            text='Only visible to friends'
            fontSize={17}
            lineHeight={28}
            color="#281E30"
          />
          <TouchableOpacity onPress={() => {setVisibleStatus(!visibleStatus);setTemporaryStatus(false);}}>
            <SvgXml
              width={55}
              height={35}
              xml={visibleStatus ? yesSwitchSvg : noSwitchSvg}
            />
          </TouchableOpacity>
        </View>
        {visibleStatus&&<View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 12, marginBottom: 30 }]}>
          <TitleText
            text='Temporary Story'
            fontSize={17}
            lineHeight={28}
            color="#281E30"
          />
          <TouchableOpacity onPress={() => setTemporaryStatus(!temporaryStatus)}>
            <SvgXml
              width={55}
              height={35}
              xml={temporaryStatus ? yesSwitchSvg : noSwitchSvg}
            />
          </TouchableOpacity>
        </View>}
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
          bottom: 20
        }}
      >
        <MyButton
          label="Post my voice"
          loading = {isLoading}
          onPress={handleSubmit}
          active = {voiceTitle!=''}
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
        info = {showShareVoice}
        onCloseModal={()=>{setShowShareVoice(false);onNavigate("Feed",1);}}
      />}
      <SwipeDownModal
        modalVisible={showModal}
        ContentModal={
          <AllCategory
            closeModal={()=>setShowModal(false)}
            selectedCategory = {category}
            setCategory={(id)=>{setCategory(id);setShowModal(false)}}
          />
        }
        ContentModalStyle={styles.swipeModal}
        onRequestClose={() => {setShowModal(false)}}
        onClose={() => {
            setShowModal(false);
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default PostingVoiceScreen;