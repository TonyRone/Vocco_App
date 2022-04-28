import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableHighlight, 
  Image, 
  Pressable, 
  ScrollView,
  Platform, StatusBar,
  ImageBackground
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';
import * as Progress from "react-native-progress";
import LinearGradient from 'react-native-linear-gradient';
import SwipeDownModal from 'react-native-swipe-down';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from '../component/TitleText';
import { Warning } from '../component/Warning';
import { BlockList } from '../component/BlockList';
import { CategoryIcon } from '../component/CategoryIcon';
import { DescriptionText } from '../component/DescriptionText';
import { ShareVoice } from '../component/ShareVoice';
import { MyButton } from '../component/MyButton';
import { MyProgressBar } from '../component/MyProgressBar';
import { MyTextField } from '../component/MyTextField';
import { VoiceItem } from '../component/VoiceItem';
import { BottomButtons } from '../component/BottomButtons';
import Tooltip from 'react-native-walkthrough-tooltip';
import RNFetchBlob from 'rn-fetch-blob';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { SvgXml } from 'react-native-svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import pauseSvg from '../../assets/common/pause.svg';
import moreSvg from '../../assets/common/more.svg';
import playSvg from '../../assets/common/play.svg';
import yesSwitchSvg from '../../assets/common/yesSwitch.svg';
import noSwitchSvg from '../../assets/common/noSwitch.svg';
import replaySvg from '../../assets/common/replay.svg';
import editSvg from '../../assets/common/edit.svg';
import publicSvg from '../../assets/record/public.svg';
import erngSvg from '../../assets/common/erng.svg';

import boxbackArrowSvg from '../../assets/profile/box_backarrow.svg';
import followSvg from '../../assets/profile/follow.svg';
import unfollowSvg from '../../assets/profile/unfollow.svg';
import blockSvg from '../../assets/profile/block.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import blackPrivacySvg from '../../assets/profile/black_privacy.svg'
import arrowPointerSvg from '../../assets/profile/arrowpointer.svg'

import shareSvg from '../../assets/post/share.svg';

import heartSvg from '../../assets/common/icons/heart.svg';
import smileSvg from '../../assets/common/icons/smile.svg';
import shineSvg from '../../assets/common/icons/shine.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { ACCESSTOKEN_KEY, windowHeight, windowWidth,API_URL } from '../../config/config';
import { styles } from '../style/Common';
import { FlatList } from 'react-native-gesture-handler';
import { BottomSheet } from 'react-native-elements/dist/bottomSheet/BottomSheet';
import { isTemplateElement } from '@babel/types';
import { CommenText } from '../component/CommenText';
import VoiceService from '../../services/VoiceService';
import { PostContext } from '../component/PostContext'
import { t } from 'i18next';

const UserProfileScreen = (props) => {

    const [showModal,setShowModal] = useState(false);
    const [deleteModal,setDeleteModal] = useState(false);
    const [isPrivated,setIsPrivated] = useState(false);
    const [fstate,setFstate] = useState('none');
    const [voices, setVoices] = useState([]);
    const [userInfo,setUserInfo] = useState({});
    const [nowVoice, setNowVoice] = useState(null);
    const [selectedIndex,setSelectedIndex] = useState(0);
    const [showContext, setShowContext] = useState(false);
    const [followloading, setFollowloading] = useState(false);
    const [voiceloading, setVoiceloading] = useState(false);
    const [showShareVoice, setShowShareVoice] = useState(null);
    const [identify, setIdentify] = useState('');

    let { refreshState } = useSelector((state) => {
      return (
          state.user
      )
    });

    let userId = props.navigation.state.params.userId;

    const onNavigate = (des, par = null) =>{
      //props.navigation.navigate(navigateScreen,{info:jsonRes})
      const resetActionTrue = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: des, params:par })],
      });
      props.navigation.dispatch(resetActionTrue);
    }

    const getUserVoices = () => {
      if(voices.length ==0 )
        setVoiceloading(true);
      VoiceService.getUserVoice(userId,voices.length).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          if(jsonRes.length>0)
            setVoices(voices.length==0?jsonRes:[...voices,...jsonRes]);
          setVoiceloading(false);
        } 
      })
      .catch(err => {
        console.log(err);
      });
    }

    const getUserInfo= () =>{
      setFollowloading(true);
      VoiceService.getProfile(userId).then(async res=>{
        if(res.respInfo.status == 200){
          setFollowloading(false);
          const jsonRes = await res.json();
          setUserInfo(jsonRes);
          if(jsonRes.isFriend)
            setFstate(jsonRes.isFriend.status);
          setIsPrivated(jsonRes.user.isPrivate);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }

    const changeFollowed =()=>{
      setFollowloading(true);
      let repo = fstate=='none'?VoiceService.followFriend(userId):VoiceService.unfollowFriend(userId);
      repo.then(async res=>{
          setFollowloading(false);
          const jsonRes = await res.json();
          console.log(res.respInfo.status);
          if(res.respInfo.status==201||res.respInfo.status==200){
            if(fstate=='none')
              setFstate('pending');
            else
              setFstate('none');
          }
        })
        .catch(err => {
          console.log(err);
        });
      setDeleteModal(false);
    }

    const OnBlockUser =()=>{
      setFollowloading(true);
      VoiceService.blockUser(userId).then(async res=>{
        setFollowloading(false);
        const jsonRes = await res.json();
        if(res.respInfo.status==201){ 
          onNavigate('Discover');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }

    const onStopPlay = () => {
      setNowVoice(null);
    };
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
  
  const pressPlayVoice = (index)=>{
    if(nowVoice!=null){
      onStopPlay();
    }
    if(nowVoice!=index){
      setTimeout(() => {
        setNowVoice(index);
      }, nowVoice?400:0);
    }
  }

    const tapHoldToAnswer = (index) => {
      setSelectedIndex(index)
      setShowContext(true);
    }
    const setLiked = ()=>{
      let tp = voices;
      tp[selectedIndex].islike = !tp[selectedIndex].islike;
      setVoices(tp);
    }

    useEffect(() => {
      //  checkLogin();
      getUserInfo()
      getUserVoices();
    }, [refreshState])
    return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <Image
          source={{uri:userInfo.user?.avatar.url}}
          resizeMode="cover"
          style={styles.topProfileContainer}
        />
        <LinearGradient
          colors={['rgba(52, 50, 56, 0)', 'rgba(42, 39, 47, 0)', 'rgba(39, 36, 44, 0.65)','rgba(34, 32, 38, 0.9)']}
          locations={[0,0.63,0.83,1]}
          start={{x: 0, y: 0}} end={{x: 0, y: 1}}
          style={[
            styles.topProfileContainer,
            { 
              position:'absolute',
              top:0,
              paddingBottom:17,
              flexDirection:'row',
              justifyContent:'space-around',
              alignItems:'flex-end',
              borderBottomWidth: userInfo.user&&userInfo.user.premium!="none"?3:0,
              borderLeftWidth: userInfo.user&&userInfo.user.premium!="none"?3:0,
              marginLeft:userInfo.user&&userInfo.user.premium!="none"?-3:0,
            }
          ]}
        >
          <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{position:'absolute',left:0,top:24}}>
            <SvgXml
              xml = {boxbackArrowSvg}
            />
          </TouchableOpacity>
          <View style={{alignItems:'center'}}>
            <DescriptionText
              text = {t('Voices')}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text = {userInfo.voices?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
          <View style={{alignItems:'center'}}>
            <DescriptionText
              text = {t('Followers')}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text = {userInfo.followers?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
          <View style={{alignItems:'center'}}>
            <DescriptionText
              text = {t('Following')}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text = {userInfo.followings?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
        </LinearGradient>
          <View style={[styles.rowSpaceBetween,{marginTop:26,paddingHorizontal:16}]}>
            <View>
              <View style={styles.rowAlignItems}>
                <TitleText
                  text={userInfo.user?.name}
                  fontFamily="SFProDisplay-Bold"
                  lineHeight={33}
                />
                {userInfo.user&&userInfo.user.premium!='none'&&
                  <Image
                    style={{
                      width:100,
                      height:33,
                      marginLeft:16
                    }}
                    source={require('../../assets/common/premiumstar.png')}
                  />
                }
              </View>
              <DescriptionText
                text={renderName(userInfo.user?.firstname,userInfo.user?.lastname)}
                fontSize={12}
                lineHeight={16}
                color={'rgba(54, 36, 68, 0.8)'}
                marginTop={3}
              />
            </View>
            <View style={styles.rowAlignItems}>
              {fstate=='accepted'&&<TouchableOpacity>
                <SvgXml
                  width={24}
                  height={24}
                  xml={followSvg}
                />
              </TouchableOpacity>}
              <TouchableOpacity onPress={()=>setShowModal(true)} style={{marginLeft:28}}>
                <SvgXml
                  width={24}
                  height={24}
                  xml={moreSvg}
                />
              </TouchableOpacity>
            </View>
          </View>

          {(fstate!='accepted')&&<MyButton
            marginTop={20}
            marginBottom={4}
            marginHorizontal = {16}
            label = {fstate=='none'?'Follow':'Sent Request...'}
            active={fstate=='none'}
            onPress={()=>changeFollowed()}
            loading={followloading}
          />}
          {(fstate!='accepted'&&isPrivated)?<>
            <View style={{marginTop:90,width:'100%',paddingHorizontal:(windowWidth-251)/2,alignItems:'center'}}>
              <SvgXml
                xml={blackPrivacySvg}
              />
              <DescriptionText
                text = {t("This account is private. Follow on user for see voices")}
                fontSize = {17}
                lineHeight = {28}
                textAlign = 'center'
                marginTop = {16}
              />
               <SvgXml
                position={'absolute'}
                //transform= {[{ rotate: '-46.73deg'}]}
                bottom = {39}
                right = {28}
                xml = {arrowPointerSvg}
              />
            </View>
            </>:<>
            <TitleText
              text={t("User voices")}
              fontSize = {20}
              marginTop={23}
              marginBottom={3}
              marginLeft={16}
            />
            {!voiceloading?(voices.length>0? <FlatList
              style={{marginTop:3}}
              data={voices}
              renderItem={({item,index})=><VoiceItem 
              key={index+'userProfile'}
              info = {item}
              props = {props}
              isPlaying = {index==nowVoice}
              onPressPostContext={()=>tapHoldToAnswer(index)}
              onPressPlay={() => pressPlayVoice(index)}
              onStopPlay={()=>onStopPlay()}
              spread = {nowVoice==null}
              />}
              keyExtractor={(item, index) => index.toString()}
              onEndReached = {()=>getUserVoices()}
              onEndThreshold={0}
            />:
            <View style = {{marginTop:windowHeight/9,alignItems:'center',width:windowWidth}}>
              <SvgXml
                  xml={box_blankSvg}
              />
              <DescriptionText
                text = {t('No result found')}
                fontSize = {17}
                lineHeight = {28}
                marginTop = {22}
              />
            </View>):
            <Progress.Circle
              indeterminate
              size={30}
              color="rgba(0, 0, 255, .7)"
              style={{ alignSelf: "center", marginTop:windowHeight/9 }}
            />
            }</>
          }
          <SwipeDownModal
          modalVisible={showModal}
          ContentModal={
            <View style={styles.swipeContainerContent}>
              <View style={[styles.rowSpaceBetween,{paddingLeft:16,paddingRight:14, paddingTop:14,paddingBottom:11,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                <View style={styles.rowAlignItems}>
                  <Image 
                    style={{
                      width:38,
                      height:38
                    }}
                    source={{uri:userInfo.user?.avatar.url}}
                  /> 
                  <View style={{marginLeft:18}}>
                    <CommenText     
                      text={userInfo.user?.name}
                      fontSize = {17}
                      lineHeight = {28}
                    />
                    <DescriptionText
                      fontSize={13}
                      lineHeight={21}
                      color={'rgba(54, 36, 68, 0.8)'}
                      text={renderName(userInfo.user?.firstname,userInfo.user?.lastname)}
                    />
                  </View>
                </View>
                <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                  <TouchableOpacity onPress={()=>setShowModal(false)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={closeBlackSvg}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height:267,borderRadius:20,borderWidth:1,borderColor:'#F0F4FC',marginTop:16,marginBottom:50,marginHorizontal:16}}>
                <TouchableOpacity onPress={()=>setShowShareVoice(true)}>
                  <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                    <DescriptionText
                      text = {t("Share")}
                      fontSize ={17}
                      lineHeight = {22}
                      color = '#281E30'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#F8F0FF'}]}>
                        <SvgXml
                          xml={shareSvg}
                        />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  setShowModal(false);
                  if(fstate=='none')
                    changeFollowed();
                  else
                    setDeleteModal(true);
                }}>
                  <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                    <DescriptionText
                      text = {fstate=='none'?t("Follow"):t("Unfollow")}
                      fontSize ={17}
                      lineHeight = {22}
                      color ='#281E30'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#F8F0FF'}]}>
                        <SvgXml
                          width={20}
                          height={20}
                          xml={unfollowSvg}
                        />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress ={()=>{setShowModal(false);OnBlockUser();}} >
                  <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                    <DescriptionText
                      text = {t("Block this user")}
                      fontSize ={17}
                      lineHeight = {22}
                      color = '#E41717'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#FFE8E8'}]}>
                        <SvgXml
                          width={20}
                          height={20}
                          xml={blockSvg}
                        />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={[styles.rowSpaceBetween,{padding:16}]}>
                    <DescriptionText
                      text = {t("Report User")}
                      fontSize ={17}
                      lineHeight = {22}
                      color = '#E41717'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#FFE8E8'}]}>
                        <SvgXml
                          width={20}
                          height={20}
                          xml={redTrashSvg}
                        />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.segmentContainer}></View>
            </View>
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setShowModal(false)}}
          onClose={() => {
              setShowModal(false);
          }}
        />
        <SwipeDownModal
          modalVisible={deleteModal}
          ContentModal={
            <View style={{height:'100%',width:'100%'}}>
              <View style={{position:'absolute', width:windowWidth-16, bottom:112, marginHorizontal:8,borderRadius:14,backgroundColor:'#E9EAEC'}}>
                <View style={{paddingTop:14,paddingBottom:8.5, width:'100%',borderBottomWidth:1,borderBottomColor:'#B6C2DB',alignItems:'center'}}>
                  <CommenText
                    text = {userInfo.user?.name}
                    fontSize = {13}
                    lineHeight = {21}
                    color = 'rgba(38, 52, 73, 0.7)'
                  />
                </View>
                <TouchableOpacity  onPress={()=>changeFollowed()}style={{paddingVertical:16}}>
                  <DescriptionText
                      text = {t("Unfollow")}
                      fontSize = {20}
                      lineHeight = {24}
                      color = '#E41717'
                      textAlign='center'
                  />
                </TouchableOpacity>
              </View>
              <View style={{position:'absolute', width:windowWidth-16, bottom:48, marginHorizontal:8,height:56,borderRadius:14,backgroundColor:'white'}}>
                <TouchableOpacity onPress={()=>setDeleteModal(false)}>
                  <DescriptionText
                      text = {t("Cancel")}
                      fontSize = {20}
                      lineHeight = {24}
                      color = '#1E61EB'
                      textAlign='center'
                      marginTop={16}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setDeleteModal(false)}}
          onClose={() => {
              setDeleteModal(false);
          }}
        />
        {showContext&&
          <PostContext
            postInfo = {voices[selectedIndex]}
            props = {props}
            onChangeIsLike = {()=>setLiked()}
            onCloseModal = {()=>setShowContext(false)}
          />
        }
        {showShareVoice&&
        <ShareVoice
          onCloseModal={()=>{setShowShareVoice(false);}}
        />}
      </KeyboardAvoidingView>
    );
  };
  
  export default UserProfileScreen;