import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Pressable,
  Image,
  Text,
  Platform,
  ImageBackground,
  Modal,
  TouchableOpacity,
  TextInput,
  Vibration,
  Keyboard
} from 'react-native';

import {
  GifSearch,
  poweredByGiphyLogoGrey,
} from 'react-native-gif-search'

import { ScrollView } from 'react-native-gesture-handler';
import * as Progress from "react-native-progress";
import { Picker } from 'emoji-mart-native'
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState, setVoiceState } from '../../store/actions';
import { DescriptionText } from '../component/DescriptionText';
import VoiceService from '../../services/VoiceService';
import { ShareVoice } from '../component/ShareVoice';
import Share from 'react-native-share';
import VoicePlayer from '../Home/VoicePlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import emojiSymbolSvg from '../../assets/common/emoji_symbol.svg'
import moreSvg from '../../assets/common/more.svg';
import editSvg from '../../assets/common/edit.svg';
import blueShareSvg from '../../assets/common/blue_share.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';

import { windowHeight, windowWidth, SHARE_CHECK, Avatars } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/SemiBoldText';
import { AnswerVoiceItem } from '../component/AnswerVoiceItem';
import '../../language/i18n';
import { StoryLikes } from '../component/StoryLikes';
import { TagFriends } from '../component/TagFriends';
import { TagItem } from '../component/TagItem';
import { NewChat } from '../component/NewChat';
import { AnswerRecordIcon } from '../component/AnswerRecordIcon';
import SwipeDownModal from 'react-native-swipe-down';

const VoiceProfileScreen = (props) => {

  let recordId = props.navigation.state.params.id, answerId = props.navigation.state.params.answerId ? props.navigation.state.params.answerId : '';
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [info, setInfo] = useState();
  const [showShareVoice, setShowShareVoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [allLikes, setAllLikes] = useState(false);
  const [showTagFriends, setShowTagFriends] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [combines, setCombines] = useState([]);
  const [answerType, setAnswerType] = useState('emoji');
  const [label, setLabel] = useState('');
  const [showComment, setShowComment] = useState(false);

  const mounted = useRef(false);

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const OnShareVoice = async () => {
    const share_check = await AsyncStorage.getItem(SHARE_CHECK);
    if (!share_check) {
      props.navigation.navigate('Share', { info: info });
    }
    else
      setShowShareVoice(true);
  }

  let { user, refreshState, voiceState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const getUserInfo = () => {
    VoiceService.getStories(0, '', '', '', recordId).then(async res => {
      if (res.respInfo.status === 200 && mounted.current) {
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

  const onCompare = (a, b) => {
    if (a.createdAt < b.createdAt)
      return 1;
    if (a.createdAt > b.createdAt)
      return -1;
    return 0;
  }

  const onCombine = (ar0, ar1) => {
    let ar = [...ar0, ...ar1];
    ar.sort(onCompare);
    setCombines(ar);
    setLoading(false);
  }

  const getAnswers = async () => {
    let stories = await VoiceService.getAnswers(recordId, answerId).then(async res => {
      if (res.respInfo.status === 200 && mounted.current) {
        return await res.json();
      }
    })
      .catch(err => {
        console.log(err);
      });

    let tags = await VoiceService.getTags(recordId, 'record').then(async res => {
      if (res.respInfo.status === 200 && mounted.current) {
        return await res.json();
      }
    })
      .catch(err => {
        console.log(err);
      });

    onCombine(stories, tags);
  }

  const editVoice = () => {
    props.navigation.navigate("PostingVoice", { info: info });
    setShowModal(false);
  }

  const onShareAudio = () => {
    Share.open({
      url: info.file.url,
      type: 'audio/mp3',
    });
  }

  const deleteConfirm = () => {
    setShowModal(false);
    setDeleteModal(true);
  }

  const deleteVoice = () => {
    setDeleteModal(false);
    VoiceService.deleteVoice(info.id).then(async res => {
      dispatch(setRefreshState(!refreshState));
      props.navigation.navigate('Home');
    })
      .catch(err => {
        console.log(err)
      })
  }

  const setIsLiked = (index) => {
    let tp = [...combines];
    tp[index].isLiked = !tp[index].isLiked;
    if (tp[index].isLiked) tp[index].likesCount++;
    else tp[index].likesCount--;
    setCombines(tp);
  }

  const onDeleteItem = (index) => {
    let tp = [...combines];
    tp.splice(index, 1);
    setCombines(tp);
  }

  const OnSetLike = () => {
    let rep;
    if (isLike == true) {
      setLikeCount(likeCount - 1);
      rep = VoiceService.recordUnAppreciate(info.id);
    }
    else {
      setLikeCount(likeCount + 1);
      rep = VoiceService.recordAppreciate({ count: 1, id: info.id });
    }
    setIsLike(!isLike);
    rep.then(() => dispatch(setRefreshState(!refreshState)));
  }

  const onAnswerBio = () => {
    VoiceService.answerBio(info.id, { bio: label }).then(async res => {
      if (res.respInfo.status == 200) {
        const answerBio = await res.json();
        answerBio.user = user;
        let tp = combines;
        tp.unshift(answerBio);
        if (mounted.current)
          setCombines([...tp]);
      }
    })
      .catch(err => {
        console.log(err);
      })
    setLabel('');
  }

  const onAnswerEmoji = (emoji) => {
    setShowComment(false);
    VoiceService.answerEmoji(info.id, { emoji }).then(async res => {
      if (res.respInfo.status == 200) {
        const emojiAnswer = await res.json();
        emojiAnswer.user = user;
        let tp = combines;
        tp.unshift(emojiAnswer);
        if (mounted.current)
          setCombines([...tp]);
      }
    })
      .catch(err => {
        console.log(err);
      })
  }

  const onAnswerGif = (gif) => {
    setShowComment(false);
    VoiceService.answerGif(info.id, { link: gif }).then(async res => {
      if (res.respInfo.status == 200) {
        const gifAnswer = await res.json();
        gifAnswer.user = user;
        let tp = combines;
        tp.unshift(gifAnswer);
        if (mounted.current)
          setCombines([...tp]);
      }
    })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    mounted.current = true;
    getUserInfo();
    getAnswers();
    dispatch(setVoiceState(voiceState + 1));
    return () => {
      mounted.current = false;
    }
  }, [refreshState])
  return (
    <View
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <ImageBackground
        source={require('../../assets/post/PostBackground.png')}
        resizeMode="stretch"
        style={{ marginTop: -10, width: windowWidth, height: 400 }}
      >
        <View style={{ marginTop: Platform.OS == 'ios' ? 60 : 35, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
            <SvgXml width="24" height="24" xml={closeBlackSvg} />
          </TouchableOpacity>
          <SemiBoldText
            text={info?.title}
            maxWidth={windowWidth - 122}
          />
          <View style={{ height: 24, width: 24 }}>
            {info?.isMine == true && <TouchableOpacity onPress={() => setShowModal(true)}>
              <SvgXml width="24" height="24" xml={moreSvg} />
            </TouchableOpacity>}
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <TouchableOpacity
            onPress={() => {
              if (info.user.id == user.id)
                props.navigation.navigate('Profile');
              else
                props.navigation.navigate('UserProfile', { userId: info.user.id });
            }}
            style={{
              alignItems: 'center'
            }}
          >
            {info && <View
              style={{ paddingRight: 12 }}
            >
              {info && <Image
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  borderColor: '#FFA002',
                  borderWidth: (info && info.user.premium != 'none') ? 2 : 0
                }}
                source={info.user.avatar ? { uri: info.user.avatar.url } : Avatars[info.user.avatarNumber].uri}
              />}
              <View style={[{ position: 'absolute', left: 36, bottom: 0, width: 30, height: 30, backgroundColor: '#FFFFFF', borderRadius: 14 }, styles.contentCenter]}>
                <Text
                  style={{
                    fontSize: 24,
                    color: 'white',
                  }}
                >
                  {info?.emoji}
                </Text>
              </View>
            </View>}
            <SemiBoldText
              text={info?.user.name}
              fontFamily="SFProDisplay-Semibold"
              marginTop={8}
              color='rgba(54, 36, 68, 0.8)'
            />
          </TouchableOpacity>
        </View>
        {info && <View
          style={{
            paddingHorizontal: 6,
            paddingVertical: 16,
            shadowColor: 'rgba(176, 148, 235, 1)',
            backgroundColor: '#FFF',
            elevation: 10,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            borderRadius: 16,
            marginTop: 16,
            marginHorizontal: 16,
          }}
        >
          <VoicePlayer
            voiceUrl={info?.file.url}
            playBtn={true}
            waveColor={info.user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
            playing={false}
            startPlay={() => { VoiceService.listenStory(recordId, 'record') }}
            stopPlay={() => { }}
            tinWidth={windowWidth / 200}
            mrg={windowWidth / 530}
            duration={info.duration * 1000}
          />
        </View>}
      </ImageBackground>
      <View style={{ marginTop: Platform.OS == 'ios' ? -60 : -100, width: '100%', flex: 1, backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 30 }}>
        <View style={{ width: '100%', marginTop: 8, alignItems: 'center' }}>
          <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: '#D4C9DE' }}>
          </View>
        </View>
        <SemiBoldText
          text={t('Answers') + ' (' + (loading ? ' ' : combines.length) + ')'}
          marginTop={19}
          marginLeft={16}
          marginBottom={15}
        />
        <ScrollView>
          {!loading ? combines.length > 0 ? combines.map((item, index) =>
            item.type ?
              <AnswerVoiceItem
                key={index + item.id + 'answerVoice'}
                props={props}
                info={item}
                onChangeIsLiked={() => setIsLiked(index)}
                onDeleteItem={() => onDeleteItem(index)}
                holdToAnswer={(v) => setIsHolding(v)}
              /> :
              <TagItem
                key={index + item.id + 'tagFriend'}
                props={props}
                info={item}
                onChangeIsLiked={() => setIsLiked(index)}
                onDeleteItem={() => onDeleteItem(index)}
              />)
            :
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{
                  width: 180,
                  height: 110
                }}
                source={require('../../assets/discover/no-answers.png')}
              />
              <DescriptionText
                text={t("No answers")}
                fontSize={17}
                lineHeight={28}
                color='#281E30'
                marginTop={24}
              />
              <DescriptionText
                text={t("Be the first one to react to this story!")}
                fontSize={17}
                textAlign='center'
                maxWidth={260}
                lineHeight={28}
                marginTop={8}
              />
            </View>
            :
            <Progress.Circle
              indeterminate
              size={30}
              color="rgba(0, 0, 255, .7)"
              style={{ alignSelf: "center", marginTop: windowHeight / 20 }}
            />
          }
          <View style={{ width: 10, height: 58 }}></View>
        </ScrollView>
        {info && <View style={{
          position: 'absolute',
          bottom: 0,
          width: windowWidth,
          height: 80,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#FFF',
          elevation: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
            marginBottom: 20,
          }}>
            <TouchableOpacity onPress={() => {
              setShowComment(!showComment);
            }}>
              <SvgXml
                style={{
                  margin: 10
                }}
                xml={emojiSymbolSvg}
              />
            </TouchableOpacity>
            <View
              style={{
                borderRadius: 40,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F2F0F5',
                flex: 1,
                marginRight: 80,
                paddingRight: 45
                //width: windowWidth * 7 / 10
              }}
            >
              <TextInput
                style={
                  {
                    fontSize: 15,
                    lineHeight: 15,
                    color: '#281E30',
                  }
                }
                value={label}
                autoCapitalize='none'
                onChangeText={(e) => setLabel(e)}
                placeholder={t("Type your answer or tag friends")}
                placeholderTextColor="rgba(59, 31, 82, 0.6)"
              />
              <TouchableOpacity disabled={label.length == 0} onPress={() => {
                onAnswerBio();
                Keyboard.dismiss();
              }}>
                <SemiBoldText
                  text={t("Post")}
                  marginLeft={5}
                  fontSize={15}
                  lineHeight={15}
                  color="#AA53F8"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>}
      </View>
      <AnswerRecordIcon
        props={props}
      />
      <SwipeDownModal
        modalVisible={showComment}
        ContentModal={
          <View style={{
            position: 'absolute',
            top: 100,
            width: windowWidth,
            alignItems: 'center'
          }}>
            <View style={{
              height: 470,
              backgroundColor: '#FFF',
              shadowColor: 'rgba(88, 74, 117, 1)',
              elevation: 10,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              borderRadius: 16,
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {answerType == 'emoji' && <Picker
                style={{ height: 400, backgroundColor: '#FFF' }}
                rows={6}
                perLine={8}
                color='#FFF'
                onSelect={(e) => onAnswerEmoji(e.native)}
              />}
              {answerType != 'emoji' && <GifSearch
                giphyApiKey={'lOPWZ8ORMutlKj0R1uqZV47rKbhuwrHt'}
                onGifSelected={(gif_url) => onAnswerGif(gif_url)}
                style={{ backgroundColor: '#FFF', height: 300, width: 368 }}
                textInputStyle={{ fontWeight: 'bold', color: 'black' }}
                loadingSpinnerColor={'black'}
                placeholderTextColor={'grey'}
                numColumns={3}
                provider={"giphy"}
                //providerLogo={poweredByGiphyLogoGrey}
                showScrollBar={false}
                noGifsFoundText={"No Gifs found :("}
              />}
              <View style={[styles.rowSpaceEvenly, { marginTop: 10, marginBottom: 10 }]}>
                <TouchableOpacity onPress={() => setAnswerType('emoji')}>
                  <Image
                    source={answerType == 'emoji' ? require('../../assets/common/Emoji_light.png') : require('../../assets/common/Emoji_dark.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAnswerType('gif')}>
                  <Image
                    source={answerType == 'emoji' ? require('../../assets/common/Gif_dark.png') : require('../../assets/common/Gif_light.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ContentModalStyle={styles.swipeModal}
        onClose={() => {
          setShowComment(false);
        }}
      />
      {info && <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <Pressable onPressOut={() => setShowModal(false)} style={styles.swipeModal}>
          <View style={styles.swipeContainerContent}>
            <View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 14, paddingTop: 14, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: '#F0F4FC' }]}>
              <View style={styles.rowAlignItems}>
                <Image
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19
                  }}
                  source={info.user.avatar ? { uri: info.user.avatar.url } : Avatars[info.user.avatarNumber].uri}
                />
                <View style={{ marginLeft: 18 }}>
                  <SemiBoldText
                    text={info?.title}
                    fontSize={17}
                    lineHeight={28}
                  />
                  <DescriptionText
                    fontSize={13}
                    lineHeight={21}
                    color={'rgba(54, 36, 68, 0.8)'}
                    text={info?.user.name}
                  />
                </View>
              </View>
              <View style={[styles.contentCenter, { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F4FC' }]}>
                <Pressable onPress={() => setShowModal(false)}>
                  <SvgXml
                    width={18}
                    height={18}
                    xml={closeBlackSvg}
                  />
                </Pressable>
              </View>
            </View>
            <View style={{ height: 200, borderRadius: 20, borderWidth: 1, borderColor: '#F0F4FC', marginTop: 16, marginBottom: 50, marginHorizontal: 16 }}>
              <Pressable onPress={editVoice}>
                <View style={[styles.rowSpaceBetween, { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F4FC' }]}>
                  <DescriptionText
                    text={t("Edit")}
                    fontSize={17}
                    lineHeight={22}
                    color='#281E30'
                  />
                  <View style={[styles.contentCenter, { height: 34, width: 34, borderRadius: 17, backgroundColor: '#F8F0FF' }]}>
                    <SvgXml
                      width={20}
                      height={20}
                      xml={editSvg}
                    />
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={onShareAudio}>
                <View style={[styles.rowSpaceBetween, { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F4FC' }]}>
                  <DescriptionText
                    text={t('Share')}
                    fontSize={17}
                    lineHeight={22}
                    color='#281E30'
                  />
                  <View style={[styles.contentCenter, { height: 34, width: 34, borderRadius: 17, backgroundColor: '#F8F0FF' }]}>
                    <SvgXml
                      width={20}
                      height={20}
                      xml={blueShareSvg}
                    />
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={deleteConfirm}>
                <View style={[styles.rowSpaceBetween, { padding: 16 }]}>
                  <DescriptionText
                    text={t("Delete")}
                    fontSize={17}
                    lineHeight={22}
                    color='#E41717'
                  />
                  <View style={[styles.contentCenter, { height: 34, width: 34, borderRadius: 17, backgroundColor: '#FFE8E8' }]}>
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
        </Pressable>
      </Modal>}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => {
          setDeleteModal(!deleteModal);
        }}
      >
        <Pressable onPressOut={() => setDeleteModal(false)} style={styles.swipeModal}>
          <View style={{ height: '100%', width: '100%' }}>
            <View style={{ position: 'absolute', width: windowWidth - 16, bottom: 112, marginHorizontal: 8, height: 122, borderRadius: 14, backgroundColor: '#E9EAEC' }}>
              <View style={{ paddingTop: 14, height: 65.5, width: '100%', borderBottomWidth: 1, borderBottomColor: '#B6C2DB', alignItems: 'center' }}>
                <SemiBoldText
                  text={t("Do you want to delete this story?")}
                  fontSize={13}
                  lineHeight={21}
                  color='rgba(38, 52, 73, 0.7)'
                />
                <SemiBoldText
                  text={t("This action cannot be undone")}
                  fontSize={13}
                  lineHeight={21}
                  color='rgba(38, 52, 73, 0.7)'
                />
              </View>
              <Pressable onPress={deleteVoice}>
                <DescriptionText
                  text={t("Delete")}
                  fontSize={20}
                  lineHeight={24}
                  color='#E41717'
                  textAlign='center'
                  marginTop={16}
                />
              </Pressable>
            </View>
            <View style={{ position: 'absolute', width: windowWidth - 16, bottom: 48, marginHorizontal: 8, height: 56, borderRadius: 14, backgroundColor: 'white' }}>
              <Pressable onPress={() => setDeleteModal(false)}>
                <DescriptionText
                  text={t('Cancel')}
                  fontSize={20}
                  lineHeight={24}
                  color='#1E61EB'
                  textAlign='center'
                  marginTop={16}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      {showShareVoice &&
        <ShareVoice
          info={info}
          onCloseModal={() => setShowShareVoice(false)}
        />
      }
      {allLikes &&
        <StoryLikes
          props={props}
          storyId={info?.id}
          storyType="record"
          onCloseModal={() => setAllLikes(false)}
        />}
      {showTagFriends &&
        <TagFriends
          info={info}
          recordId={info.id}
          onCloseModal={() => setShowTagFriends(false)}
        />
      }
      {showFriendsList && <NewChat
        props={props}
        recordId={info.id}
        onCloseModal={() => setShowFriendsList(false)}
      />}
    </View>
  );
};

export default VoiceProfileScreen;