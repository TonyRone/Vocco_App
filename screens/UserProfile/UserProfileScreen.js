import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';
import * as Progress from "react-native-progress";
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import SwipeDownModal from 'react-native-swipe-down';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from '../component/TitleText';
import { Warning } from '../component/Warning';
import { BlockList } from '../component/BlockList';
import { CategoryIcon } from '../component/CategoryIcon';
import { DescriptionText } from '../component/DescriptionText';
import { setRefreshState } from '../../store/actions';
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
import { Stories } from '../component/Stories';
import { t } from 'i18next';
import { instanceOf } from 'prop-types';
import { TemporaryStories } from '../component/TemporaryStories';
import { FollowUsers } from '../component/FollowUsers';

const UserProfileScreen = (props) => {

    const [showModal,setShowModal] = useState(false);
    const [deleteModal,setDeleteModal] = useState(false);
    const [isPrivate,setIsPrivate] = useState(false);
    const [followState,setFollowState] = useState('none');
    const [voices, setVoices] = useState([]);
    const [userInfo,setUserInfo] = useState({});
    const [nowVoice, setNowVoice] = useState(null);
    const [selectedIndex,setSelectedIndex] = useState(0);
    const [showContext, setShowContext] = useState(false);
    const [followLoading, setFollowLoading] = useState(true);
    const [voiceLoading, setVoiceLoading] = useState(true);
    const [showShareVoice, setShowShareVoice] = useState(null);
    const [loadMore, setLoadMore] = useState(10);
    const [showEnd,setShowEnd] = useState(false);
    const [loadKey, setLoadKey] = useState(0);
    const [allFollows, setAllFollows] = useState("");

    let { user, refreshState } = useSelector((state) => {
      return (
          state.user
      )
    });

    const dispatch = useDispatch();

    let userId = props.navigation.state.params.userId;

    const getUserVoices = () => {
      if(loadMore < 10){
        onShowEnd();
        return ;
      }
      if(voices.length ==0 )
        setVoiceLoading(true);
      VoiceService.getUserVoice(userId,voices.length).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          if(jsonRes.length>0)
            setVoices(voices.length==0?jsonRes:[...voices,...jsonRes]);
          setLoadMore(jsonRes.length);
          setVoiceLoading(false);
        } 
      })
      .catch(err => {
        console.log(err);
      });
    }

    const getUserInfo= () =>{
      setFollowLoading(true);
      VoiceService.getProfile(userId).then(async res=>{
        if(res.respInfo.status == 200){
          setFollowLoading(false);
          const jsonRes = await res.json();
          setUserInfo(jsonRes);
          if(jsonRes.isFriend)
            setFollowState(jsonRes.isFriend.status);
          setIsPrivate(jsonRes.user.isPrivate);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }

    const changeFollowed =()=>{
      setFollowLoading(true);
      let repo = followState=='none'?VoiceService.followFriend(userId):VoiceService.unfollowFriend(userId);
      repo.then(async res=>{
          setFollowLoading(false);
          if(res.respInfo.status==201||res.respInfo.status==200){
            if(followState=='none')
              setFollowState('pending');
            else
              setFollowState('none');
          }
        })
        .catch(err => {
          console.log(err);
        });
      setDeleteModal(false);
    }

    const OnBlockUser =()=>{
      setFollowLoading(true);
      VoiceService.blockUser(userId).then(async res=>{
        setFollowLoading(false);
        const jsonRes = await res.json();
        if(res.respInfo.status==201){ 
          dispatch(setRefreshState(!refreshState));
          props.navigation.navigate('Discover');
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
    let item = tp[selectedIndex].isLike;
    if(item)
      tp[selectedIndex].likesCount --;
    else
      tp[selectedIndex].likesCount ++;
    tp[selectedIndex].isLike = !tp[selectedIndex].isLike;
    setVoices(tp);
  }

  const onChangeLike = (id, val)=>{
    let tp = voices;
    let item = tp[id].isLike;
    if(item === true){
      tp[id].likesCount --;
    }
    else{
      tp[id].likesCount ++;
    }
    tp[id].isLike = val;
    setVoices(tp);
  }

  
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  const onShowEnd = ()=>{
    if(showEnd) return ;
    setShowEnd(true);
    setTimeout(() => {
     setShowEnd(false);
    }, 2000);
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
        <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{position:'absolute',left:0,top:Platform.OS=='ios'?24:12}}>
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
        <TouchableOpacity onPress={()=>setAllFollows("Followers")} style={{alignItems:'center'}}>
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
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setAllFollows("Following")} style={{alignItems:'center'}}>
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
        </TouchableOpacity>
      </LinearGradient>
      <TemporaryStories
        props={props}
        userId={userId}
      />
      <ScrollView
          style = {{ marginTop:16}}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              setLoadKey(loadKey+1)
            }
          }}
          scrollEventThrottle={400}
      >
        <View style={[styles.rowSpaceBetween,{paddingHorizontal:16}]}>
          <View>
            <View style={styles.rowAlignItems}>
              <TitleText
                text={userInfo.user?.name}
                fontFamily="SFProDisplay-Bold"
                lineHeight={33}
              />
              {userInfo.user&&userInfo.user.premium!='none'&&
                <Pressable disabled={user.premium!='none'} onPress={()=>props.navigation.navigate("Premium")}>
                  <Image
                  style={{
                    width:100,
                    height:33,
                    marginLeft:16
                  }}
                  source={require('../../assets/common/premiumstar.png')}
                />
                </Pressable>
              }
            </View>
            {/* <DescriptionText
              text={renderName(userInfo.user?.firstname,userInfo.user?.lastname)}
              fontSize={12}
              lineHeight={16}
              color={'rgba(54, 36, 68, 0.8)'}
              marginTop={3}
            /> */}
          </View>
          <View style={styles.rowAlignItems}>
            {followState=='accepted'&&<TouchableOpacity>
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
        {userInfo.user?.bio&&<View style={{paddingHorizontal:16}}>
          <DescriptionText
            numberOfLines={3}
            marginTop = {15}
            text = {userInfo.user.bio}
          />
        </View>}
        {(followState!='accepted')&&<MyButton
          marginTop={20}
          marginBottom={4}
          marginHorizontal = {16}
          label = {followState=='none'?t("Follow"):t("Sent Request...")}
          //active={followState=='none'}
          onPress={()=>followLoading?null:changeFollowed()}
          loading={followLoading}
        />}
        {(followState!='accepted'&&isPrivate)?<>
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
          </>:
          <>
            <TitleText
              text={t("User voices")}
              fontSize = {20}
              marginTop={23}
              marginBottom={3}
              marginLeft={16}
            />
            <Stories
              props={props}
              loadKey = {loadKey}
              screenName = "userProfile"
              userId = {userId}
            />
          </>
        }
        </ScrollView>
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
                if(followState=='none')
                  changeFollowed();
                else
                  setDeleteModal(true);
              }}>
                <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                  <DescriptionText
                    text = {followState=='none'?t("Follow"):t("Unfollow")}
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
      {allFollows!=''&&
        <FollowUsers
          props={props}
          userId = {userId}
          followType={allFollows}
          onCloseModal={()=>setAllFollows('')}
        />
      }
    </KeyboardAvoidingView>
  );
};

export default UserProfileScreen;