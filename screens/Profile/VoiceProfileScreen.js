import React, { useState, useEffect, useRef ,useCallback} from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Pressable,
  Image, 
  Text,
  Platform,
  ImageBackground
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Progress from "react-native-progress";
import { NavigationActions, StackActions } from 'react-navigation';
import {useTranslation} from 'react-i18next';
import { HeartIcon } from '../component/HeartIcon';
import SwipeDownModal from 'react-native-swipe-down';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState, setVoiceState } from '../../store/actions';
import { DescriptionText } from '../component/DescriptionText';
import { FlatList } from 'react-native-gesture-handler';
import VoiceService from '../../services/VoiceService';
import { ShareVoice } from '../component/ShareVoice';
import { AnswerReply } from '../component/AnswerReply';
import Share from 'react-native-share';
import VoicePlayer from '../Home/VoicePlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import moreSvg from '../../assets/common/more.svg';
import editSvg from '../../assets/common/edit.svg';
import blueShareSvg from '../../assets/common/blue_share.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';

import { windowHeight, windowWidth , SHARE_CHECK } from '../../config/config';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import { AnswerVoiceItem } from '../component/AnswerVoiceItem';
import '../../language/i18n';
import EmojiPicker from 'rn-emoji-keyboard';
import { RecordIcon } from '../component/RecordIcon';
import { StoryLikes } from '../component/StoryLikes';
import { TagFriends } from '../component/TagFriends';

const VoiceProfileScreen = (props) => {

    let recordId = props.navigation.state.params.id, answerId=props.navigation.state.params.answerId?props.navigation.state.params.answerId:'';
    const [showModal,setShowModal] = useState(false);
    const [deleteModal,setDeleteModal] = useState(false);
    const [answerVoices,setAnswerVoices] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [info, setInfo] = useState();
    const [showShareVoice, setShowShareVoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isHolding, setIsHolding] = useState(false);
    const [allLikes, setAllLikes] = useState(false);
    const [showTagFriends, setShowTagFriends] = useState(false);

    const dispatch = useDispatch();

    const {t, i18n} = useTranslation();

    const OnShareVoice = async()=>{
      const share_check = await AsyncStorage.getItem(SHARE_CHECK);
      if (!share_check){
        props.navigation.navigate('Share',{info:info});
      }
      else
        setShowShareVoice(true);
    }

    let { user , refreshState , voiceState} = useSelector((state) => {
      return (
          state.user
      )
    });

    const onNavigate = (des, par = null) =>{
      //props.navigation.navigate(navigateScreen,{info:jsonRes})
      const resetActionTrue = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: des, params:par })],
      });
      props.navigation.dispatch(resetActionTrue);
    }

    const getUserInfo =()=>{
      VoiceService.getStories(0, '', '', '', recordId).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setIsLike(jsonRes[0].isLike);
          setLikeCount(jsonRes[0].likesCount);
          setInfo(jsonRes[0]);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }

    const getAnswerVoices =()=> {
      //setLoading(true);
      VoiceService.getAnswerVoices(recordId,answerId).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setAnswerVoices(jsonRes);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
    }

    const editVoice = ()=>{
      props.navigation.navigate("PostingVoice",{info:info});
      setShowModal(false);
    }

    const onShareAudio = useCallback(()=> {
      // VoiceService.getVoiceFile(info.file.url).then(res=>{
      //   if(res.respInfo.status==200){
      //     let filePath= `${Platform.OS === 'android' ? '' : ''}${res.path()}`;
          Share.open({
            url: info.file.url,
            type: 'audio/mp3',
          });
      //   }
      // })
      // .catch(err=>{
      //   console.log(err);
      // })
    }, []);

    const deleteConfirm = ()=>{
      setShowModal(false);
      setDeleteModal(true);
    }

    const deleteVoice = ()=>{
      setDeleteModal(false);
      VoiceService.deleteVoice(info.id).then(async res=>{
        dispatch(setRefreshState(!refreshState));
        props.navigation.goBack();
      })
      .catch(err=>{
        console.log(err)
      })
    }

    const setIsLiked= (index)=>{
      let tp = [...answerVoices];
      tp[index].isLiked = !tp[index].isLiked;
      if(tp[index].isLiked) tp[index].likesCount ++;
      else tp[index].likesCount --;
      setAnswerVoices(tp);
    }

    const onDeleteAnswer=(index)=>{
      let tp = [...answerVoices];
      tp.splice(index,1);
      setAnswerVoices(tp);
    }

    const OnSetLike =()=>{
      let rep;
      if(isLike == true){
        setLikeCount(likeCount-1);
        rep = VoiceService.recordUnAppreciate(info.id);
      }
      else{
        setLikeCount(likeCount+1);
        rep = VoiceService.recordAppreciate({count:1,id:info.id});
      }
      setIsLike(!isLike);
      rep.then(()=>dispatch(setRefreshState(!refreshState)));
    }

    useEffect(() => {
      getUserInfo();
      getAnswerVoices();
      dispatch(setVoiceState(voiceState+1));
    }, [refreshState])
    return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <ImageBackground
          source={require('../../assets/post/PostBackground.png')}
          resizeMode="stretch"
          style={{marginTop:-10,width:windowWidth,height:400}}
        >
          <View style={{marginTop:Platform.OS=='ios'?60:35,paddingHorizontal:16, flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
            <TouchableOpacity onPress={()=>props.navigation.goBack()}>
              <SvgXml width="24" height="24" xml={closeBlackSvg} />  
            </TouchableOpacity>
            <CommenText
              text = {info?.title}
              maxWidth = {windowWidth-122}
            />
            <View style={{height:24, width:24}}>
              {info?.isMine==true&&<TouchableOpacity onPress={()=>setShowModal(true)}>
                <SvgXml width="24" height="24" xml={moreSvg} />  
              </TouchableOpacity>}
            </View>
          </View>
          <View style={{alignItems:'center', marginTop:22}}>
            <TouchableOpacity onPress = {()=>{
              if(info.user.id==user.id)
                props.navigation.navigate('Profile');
              else
                props.navigation.navigate('UserProfile',{userId:info.user.id});
            }}
              style={{paddingRight:12}}
            >
              <Image 
                style={{
                  width:64,
                  height:64,
                  borderRadius:32,
                  borderColor:'#FFA002',
                  borderWidth:(info&&info.user.premium!='none')?2:0
                }}
                source={{uri:info?.user.avatar.url}}
              />
              <View style={[{position:'absolute', left:36, bottom:0, width:30,height:30,backgroundColor:'#FFFFFF',borderRadius:14},styles.contentCenter]}>
                <Text
                  style={{
                    fontSize: 24,
                    color: 'white',
                  }}
                >
                  {info?.emoji}
                </Text> 
              </View>
              {/* <DescriptionText
                fontSize={13}
                lineHeight={21}
                color={'rgba(54, 36, 68, 0.8)'}
                text = {info?.user.name}
                marginLeft={8}
              /> */}
            </TouchableOpacity>
            <CommenText
              text={info?.user.name}
              fontFamily="SFProDisplay-Semibold"
              marginTop={8}
              color = 'rgba(54, 36, 68, 0.8)'
            />
          </View>
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 16,
              backgroundColor: '#FFF',
              shadowColor: 'rgba(176, 148, 235, 1)',
              elevation:10,
              shadowOffset:{width: 0, height: 2},
              shadowOpacity:0.5,
              shadowRadius:8,
              borderRadius: 16,
              marginTop:16,
              marginHorizontal: 16,
            }}
          >
            <VoicePlayer
              voiceUrl = {info?.file.url}
              playBtn = {true}
              premium = {info?.user.premium !='none'}
              playing = {false}
              stopPlay = {()=>{}}
              tinWidth={windowWidth/200}
              mrg={windowWidth/530}
            />
          </View>
        </ImageBackground>
        <View style={{marginTop:Platform.OS=='ios'?-60:-100, width:'100%', height:windowHeight-390, backgroundColor:'white',borderTopLeftRadius:32,borderTopRightRadius:30}}>
          <View style={{width:'100%',marginTop:8,alignItems:'center'}}>
            <View style={{width:48,height:4,borderRadius:2,backgroundColor:'#D4C9DE'}}>
            </View>
          </View>
          <CommenText
            text={t('Answers')+' ('+(loading?' ':(answerVoices.length-(answerId==''?0:1)))+')'}
            marginTop={19}
            marginLeft={16}
            marginBottom={15}
          />
          {!loading?<FlatList
            data={answerVoices}
            renderItem={({item,index})=>
              (item&&!(index>0&&item.id==answerVoices[0].id))?
              <AnswerVoiceItem 
                key={index+item.id+'answerVoice'}
                props={props}
                info = {item}
                onChangeIsLiked = {()=>setIsLiked(index)}
                onDeleteItem = {()=>onDeleteAnswer(index)}
                holdToAnswer={(v)=>setIsHolding(v)}
              />:null
            }
            keyExtractor={(item, index) => index.toString()}
          />:
          <Progress.Circle
            indeterminate
            size={30}
            color="rgba(0, 0, 255, .7)"
            style={{ alignSelf: "center", marginTop:windowHeight/20 }}
          />
          }
        </View>
        {isHolding==false&&<View
          style={{
            position:'absolute',
            bottom:25,
            width:'100%',
            paddingHorizontal:16,
            alignItems:'center',
            flex:1
          }}
        > 
          <View style={{
            backgroundColor:'#FFF',
            shadowColor: 'rgba(50, 50, 50, 1)',
            elevation:10,
            shadowOffset:{width: 0, height: 2},
            shadowOpacity:0.5,
            shadowRadius:8,
            borderRadius:27,
            padding:10,
            width: windowWidth-32,
            height:56,
            alignItems:'center',
            flex:1,
            zIndex:0
          }}>
            <View style={{
              alignItems:'center',
              marginBottom:-42,
              marginTop:-37,
              zIndex:10
            }}>
              <View style={{width:54,height:54}}>
                {/* <SvgXml
                  width={54}
                  height={54}
                  xml={recordSvg}
                /> */}
              </View>
              <CommenText
                text = ""
                fontFamily="SFProDisplay-Semibold"
                fontSize={12}
                lineHeight={12}
                marginTop={10}
                color={'rgba(54, 36, 68, 0.8)'}
              />
            </View>
            <View style={[{width:windowWidth-32,paddingHorizontal:16},styles.rowSpaceBetween]}>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={()=>setShowTagFriends(true)}>
                  <View style={[styles.row, {alignItems:'center'}]}>
                    <Image
                      style={{
                        width:24,
                        height:24
                      }}
                      source={require('../../assets/post/tagFriends.png')}
                    />
                  </View>
                </TouchableOpacity>
                <CommenText
                  text = {t("Tag friends")}
                  fontFamily="SFProDisplay-Semibold"
                  fontSize = {12}
                  lineHeight = {12}
                  marginTop = {6}
                  color = {'rgba(54, 36, 68, 0.8)'}
                />
              </View>
              <View style={{alignItems:'center',marginRight:20}}>
                <HeartIcon
                  isLike = {isLike}
                  height = {24}
                  OnSetLike = {()=>OnSetLike()}
                />
                <TouchableOpacity onPress={()=>setAllLikes(true)}>
                  <CommenText
                    text = {likeCount}
                    fontFamily="SFProDisplay-Semibold"
                    fontSize = {12}
                    lineHeight = {12}
                    marginTop = {6}
                    color = {'rgba(54, 36, 68, 0.8)'}
                  />
                </TouchableOpacity>
              </View>
              <View></View>
              <View style={{alignItems:'center',marginLeft:20}}>
                <TouchableOpacity onPress={()=>OnShareVoice()}>
                  <View style={[styles.row, {alignItems:'center'}]}>
                    <Image
                      style={{
                        width:24,
                        height:24
                      }}
                      source={require('../../assets/post/chat.png')}
                    />
                  </View>
                </TouchableOpacity>
                <CommenText
                  text = {t("To chat")}
                  fontFamily="SFProDisplay-Semibold"
                  fontSize = {12}
                  lineHeight = {12}
                  marginTop = {6}
                  color = {'rgba(54, 36, 68, 0.8)'}
                />
              </View>
              <View style={{alignItems:'center'}}>
                <TouchableOpacity onPress={()=>OnShareVoice()}>
                  <View style={[styles.row, {alignItems:'center'}]}>
                    <Image
                      style={{
                        width:48,
                        height:24
                      }}
                      source={require('../../assets/post/socialShare.png')}
                    />
                  </View>
                </TouchableOpacity>
                <CommenText
                  text = {t('Share')}
                  fontFamily="SFProDisplay-Semibold"
                  fontSize = {12}
                  lineHeight = {12}
                  marginTop = {6}
                  color = {'rgba(54, 36, 68, 0.8)'}
                />
              </View>
            </View>
          </View>
        </View>}
        {/* {showEmoji&&
          <EmojiPicker
            onEmojiSelected={(icon)=>selectIcon(icon.emoji)}
            open={showEmoji}
            onClose={() => setShowEmojis(false)} />
        } */}
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
                    source={require('../../assets/emotican/frequently/image_'+2+'.png')}
                  /> 
                  <View style={{marginLeft:18}}>
                    <CommenText
                      text = {info?.title}
                      fontSize = {17}
                      lineHeight = {28}
                    />
                    <DescriptionText
                      fontSize={13}
                      lineHeight={21}
                      color={'rgba(54, 36, 68, 0.8)'}
                      text = {info?.user.name}
                    />
                  </View>
                </View>
                <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                  <Pressable onPress={()=>setShowModal(false)}>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={closeBlackSvg}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={{height:200,borderRadius:20,borderWidth:1,borderColor:'#F0F4FC',marginTop:16,marginBottom:50,marginHorizontal:16}}>
                <Pressable onPress={editVoice}>
                  <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                    <DescriptionText
                      text = {t("Edit Voice")}
                      fontSize ={17}
                      lineHeight = {22}
                      color = '#281E30'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#F8F0FF'}]}>
                        <SvgXml
                          width={20}
                          height={20}
                          xml={editSvg}
                        />
                    </View>
                  </View>
                </Pressable>
                <Pressable onPress={onShareAudio}>
                  <View style={[styles.rowSpaceBetween,{padding:16,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
                    <DescriptionText
                      text = {t('Share')}
                      fontSize ={17}
                      lineHeight = {22}
                      color = '#281E30'
                    />
                    <View style={[styles.contentCenter,{height:34,width:34,borderRadius:17,backgroundColor:'#F8F0FF'}]}>
                        <SvgXml
                          width={20}
                          height={20}
                          xml={blueShareSvg}
                        />
                    </View>
                  </View>
                </Pressable>
                <Pressable onPress={deleteConfirm}>
                  <View style={[styles.rowSpaceBetween,{padding:16}]}>
                    <DescriptionText
                      text = {t("Delete Voice")}
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
                </Pressable>
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
              <View style={{position:'absolute', width:windowWidth-16, bottom:112, marginHorizontal:8,height:122,borderRadius:14,backgroundColor:'#E9EAEC'}}>
                <View style={{paddingTop:14, height:65.5,width:'100%',borderBottomWidth:1,borderBottomColor:'#B6C2DB',alignItems:'center'}}>
                  <CommenText
                    text = {t("Delete this voice?")}
                    fontSize = {13}
                    lineHeight = {21}
                    color = 'rgba(38, 52, 73, 0.7)'
                  />
                  <CommenText
                    text = {t("This action cannot be undone")}
                    fontSize = {13}
                    lineHeight = {21}
                    color = 'rgba(38, 52, 73, 0.7)'
                  />
                </View>
                <Pressable onPress={deleteVoice}>
                  <DescriptionText
                      text = {t("Delete Voice")}
                      fontSize = {20}
                      lineHeight = {24}
                      color = '#E41717'
                      textAlign='center'
                      marginTop={16}
                  />
                </Pressable>
              </View>
              <View style={{position:'absolute', width:windowWidth-16, bottom:48, marginHorizontal:8,height:56,borderRadius:14,backgroundColor:'white'}}>
                <Pressable onPress={()=>setDeleteModal(false)}>
                  <DescriptionText
                      text = {t('Cancel')}
                      fontSize = {20}
                      lineHeight = {24}
                      color = '#1E61EB'
                      textAlign='center'
                      marginTop={16}
                  />
                </Pressable>
              </View>
            </View>
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setDeleteModal(false)}}
          onClose={() => {
              setDeleteModal(false);
          }}
        />
        {showShareVoice&&
          <ShareVoice
            info = {info}
            onCloseModal={()=>setShowShareVoice(false) }
          />
        }
        {isHolding==false&&<RecordIcon
          props={props}
          bottom={50}
          left = {windowWidth/2-27}
        />}
        {allLikes&&
        <StoryLikes
          props={props}
          storyId={info?.id}
          storyType="record"
          onCloseModal={()=>setAllLikes(false)}
        />}
        {showTagFriends&&
          <TagFriends
            info = {info}
            onCloseModal = {()=>setShowTagFriends(false)}
          />
        }
      </KeyboardAvoidingView>
    );
  };
  
  export default VoiceProfileScreen;