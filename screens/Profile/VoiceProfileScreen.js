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

import { NavigationActions, StackActions } from 'react-navigation';
import {useTranslation} from 'react-i18next';
import { HeartIcon } from '../component/HeartIcon';
import SwipeDownModal from 'react-native-swipe-down';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState } from '../../store/actions';
import { DescriptionText } from '../component/DescriptionText';
import { FlatList } from 'react-native-gesture-handler';
import VoiceService from '../../services/VoiceService';
import { ShareVoice } from '../component/ShareVoice';
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
import shareSvg from '../../assets/post/share.svg';

import { windowHeight, windowWidth , SHARE_CHECK } from '../../config/config';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import { AnswerVoiceItem } from '../component/AnswerVoiceItem';
import '../../language/i18n';
import EmojiPicker from 'rn-emoji-keyboard';

const VoiceProfileScreen = (props) => {

    let info = props.navigation.state.params.info, answerId=props.navigation.state.params.answerId?props.navigation.state.params.answerId:'';
    const [showModal,setShowModal] = useState(false);
    const [deleteModal,setDeleteModal] = useState(false);
    const [answerVoices,setAnswerVoices] = useState([]);
    const [refresh,setRefresh] = useState(false);
    //const [reactions,setReactions] = useState(info.reactions);
    //const [reactionsCount,setReactionsCount]= useState(info.reactionsCount)
    //const [showEmoji,setShowEmojis] = useState(false);
    const [isLike, setIsLike] = useState(info.isLike);
    const [likeCount, setLikeCount] = useState(info.likesCount);
    const [nowVoice,setNowVoice] = useState(null);
    const [showShareVoice, setShowShareVoice] = useState(null);

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

    let { user , refreshState} = useSelector((state) => {
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

    const getAnswerVoices =()=> {
      VoiceService.getAnswerVoices(info.id,answerId).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setAnswerVoices(jsonRes);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }

    const onStopPlay = () => {
      setNowVoice(null);
    };
  
    const pressPlayVoice = (index)=>{
      if(nowVoice!=null){
        onStopPlay();
      }
      if(nowVoice != index){
        setTimeout(() => {
          setNowVoice(index);
        }, nowVoice!=null?400:0);
      }
    }

    const editVoice = ()=>{
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
      let tp = answerVoices;
      tp[index].isLiked = !tp[index].isLiked;
      if(tp[index].isLiked) tp[index].likesCount ++;
      else tp[index].likesCount --;
      setAnswerVoices(tp);
      setRefresh(!refresh);
    }

    const selectIcon = (icon)=>{
      setShowEmojis(false);
      VoiceService.addReaction({id:info.id,emoji:icon}).then(async res=>{
        const jsonRes = await res.json();
        if(res.respInfo.status==201){
          setReactions(jsonRes.lastreactions);
          setReactionsCount(jsonRes.reactioncount);
          dispatch(setRefreshState(!refreshState));
        }
      })
      .catch(err=>{
        console.log(err)
      })
      let i, temp = reactions;
      if(temp.length==0)
        temp = [];
      for( i=0 ; i < reactions.length; i++ ){
        if(reactions[i].user.id == user.id){
          temp[i].emoji = icon;
          break;
        }
      }
      if(i==temp.length){
        for(i=2; i>0; i--) {
          if(i>reactions.length) continue;
          temp[i]=temp[i-1];
        }
        if(temp.length==0){
          temp.push({emoji:icon,user:{id:user.id}});
        }
        else temp[0]={emoji:icon,user:{id:user.id}};
        if(reactions.length<3)
          setReactionsCount(reactionsCount+1);
        setReactions(temp);
      }
      else
        setReactions(temp);
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
      getAnswerVoices();
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
          <View style={{marginTop:Platform.OS=='ios'?55:25,paddingHorizontal:16, flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
            <TouchableOpacity onPress={()=>props.navigation.goBack()}>
              <SvgXml width="24" height="24" xml={closeBlackSvg} />  
            </TouchableOpacity>
            {info?.isMine==true&&<TouchableOpacity onPress={()=>setShowModal(true)}>
              <SvgXml width="24" height="24" xml={moreSvg} />  
            </TouchableOpacity>}
          </View>
          <View style={[{marginTop:26,marginLeft:16},styles.rowAlignItems]}>
            <View style={[{width:64,height:64,backgroundColor:'#FFFFFF',borderRadius:32,marginRight:20},styles.contentCenter]}>
              <Text
                style={{
                  fontSize: 45,
                  color: 'white',
                }}
              >
                {info?.emoji}
              </Text> 
            </View>
            <View>
              <CommenText
                text = {info?.title}
                maxWidth = {windowWidth-122}
                marginBottom={7}
              />
              <TouchableOpacity style={styles.rowAlignItems} onPress = {()=>{
                if(info.user.id==user.id)
                  props.navigation.navigate('Profile');
                else
                  props.navigation.navigate('UserProfile',{userId:info.user.id});
              }}>
                <Image 
                  style={{
                    width:24,
                    height:24,
                    borderRadius:7
                  }}
                  source={{uri:info?.user.avatar.url}}
                />
                <DescriptionText
                  fontSize={13}
                  lineHeight={21}
                  color={'rgba(54, 36, 68, 0.8)'}
                  text = {info?.user.name}
                  marginLeft={8}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: 24,
              paddingHorizontal: 8,
              paddingVertical: 16,
              backgroundColor: '#FFF',
              shadowColor: 'rgba(176, 148, 235, 1)',
              elevation:10,
              shadowOffset:{width: 0, height: 2},
              shadowOpacity:0.5,
              shadowRadius:8,
              borderRadius: 16,
              marginHorizontal: 16,
            }}
          >
            <VoicePlayer
              voiceUrl = {info?.file.url}
              playBtn = {true}
              replayBtn = {true}
              premium = {info.user.premium !='none'}
              playing = {false}
              stopPlay = {()=>{}}
            />
          </View>
        </ImageBackground>
        <View style={{marginTop:-105, width:'100%', height:windowHeight-400, backgroundColor:'white',borderTopLeftRadius:32,borderTopRightRadius:30}}>
          <View style={{width:'100%',marginTop:8,alignItems:'center'}}>
            <View style={{width:48,height:4,borderRadius:2,backgroundColor:'#D4C9DE'}}>
            </View>
          </View>
          <CommenText
            text={t('Answers')+' ('+(answerVoices.length-(answerId==''?0:1))+')'}
            marginTop={19}
            marginLeft={16}
            marginBottom={15}
          />
          <FlatList
            data={answerVoices}
            renderItem={({item,index})=>
              (item&&!(index>0&&item.id==answerVoices[0].id))?
              <AnswerVoiceItem 
                key={index+'answerVoice'}
                props={props}
                info = {item}
                isPlaying = {index==nowVoice}
                onPressPlay={() => pressPlayVoice(index)}
                onStopPlay={()=>onStopPlay()}
                onChangeIsLiked = {()=>setIsLiked(index)}
              />:null
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View
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
              marginBottom:-39,
              marginTop:-35,
              zIndex:10
            }}>
              <TouchableOpacity onPress={()=>props.navigation.navigate("HoldRecord",{info:info})}>
                <SvgXml
                  width={54}
                  height={54}
                  xml={recordSvg}
                />
              </TouchableOpacity>
              <CommenText
                text = {t('Tap&Hold to answer')}
                fontSize={12}
                lineHeight={12}
                marginTop={7}
                color={'rgba(54, 36, 68, 0.8)'}
              />
            </View>
            <View style={[{width:windowWidth-32},styles.rowSpaceBetween]}>
              <View style={{alignItems:'center',marginLeft:31}}>
                {/* <View style={[styles.row, {alignItems:'center'}]}>
                {reactionsCount>0?
                  reactions?.map((eLikes, index) => {
                    return (
                      <Text
                        key = {index+'reactionProfile'}
                        style={{
                          fontSize: 20,
                          color: 'white',
                        }}
                      >
                        {eLikes.emoji}
                      </Text>
                    )
                  })
                  :
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      opacity:0.5
                    }}
                  >
                    {"😂"}
                  </Text>
                }
                </View> */}
                <HeartIcon
                  isLike = {isLike}
                  height = {24}
                  OnSetLike = {()=>OnSetLike()}
                />
                <CommenText
                  text = {likeCount}
                  fontSize = {12}
                  lineHeight = {12}
                  marginTop = {6}
                  color = {'rgba(54, 36, 68, 0.8)'}
                />
              </View>
              <View style={{alignItems:'center',marginRight:20}}>
                <TouchableOpacity onPress={()=>OnShareVoice()}>
                  <View style={[styles.row, {alignItems:'center'}]}>
                    <SvgXml
                      width={68}
                      height={20}
                      xml={shareSvg}
                    />
                  </View>
                </TouchableOpacity>
                <CommenText
                  text = {t('Share')}
                  fontSize = {12}
                  lineHeight = {12}
                  marginTop = {6}
                  color = {'rgba(54, 36, 68, 0.8)'}
                />
              </View>
            </View>
          </View>
        </View>
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
                      text = {info.title}
                      fontSize = {17}
                      lineHeight = {28}
                    />
                    <DescriptionText
                      fontSize={13}
                      lineHeight={21}
                      color={'rgba(54, 36, 68, 0.8)'}
                      text = {info.user.name}
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
              <View style={{height:200,borderRadius:20,borderWidth:1,borderColor:'#F0F4FC',marginTop:16,marginBottom:50,marginHorizontal:16}}>
                <TouchableOpacity onPress={editVoice}>
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
                </TouchableOpacity>
                <TouchableOpacity onPress={onShareAudio}>
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
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteConfirm}>
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
                <TouchableOpacity onPress={deleteVoice}>
                  <DescriptionText
                      text = {t("Delete Voice")}
                      fontSize = {20}
                      lineHeight = {24}
                      color = '#E41717'
                      textAlign='center'
                      marginTop={16}
                  />
                </TouchableOpacity>
              </View>
              <View style={{position:'absolute', width:windowWidth-16, bottom:48, marginHorizontal:8,height:56,borderRadius:14,backgroundColor:'white'}}>
                <TouchableOpacity onPress={()=>setDeleteModal(false)}>
                  <DescriptionText
                      text = {t('Cancel')}
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
        {showShareVoice&&
          <ShareVoice
            info = {info}
            onCloseModal={()=>setShowShareVoice(false) }
          />
        }
      </KeyboardAvoidingView>
    );
  };
  
  export default VoiceProfileScreen;