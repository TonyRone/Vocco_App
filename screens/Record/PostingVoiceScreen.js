import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Vibration,
  Image,
  Modal
} from 'react-native';

import * as Progress from "react-native-progress";
import { useSelector, useDispatch } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { NavigationActions, StackActions } from 'react-navigation';
import { TitleText } from '../component/TitleText';
import RNVibrationFeedback from 'react-native-vibration-feedback';

import { CategoryIcon } from '../component/CategoryIcon';
import { MyButton } from '../component/MyButton';
import EmojiPicker from 'rn-emoji-keyboard';
import { ShareHint } from '../component/ShareHint';
import { ShareVoice } from '../component/ShareVoice';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import yesSwitchSvg from '../../assets/common/yesSwitch.svg';
import noSwitchSvg from '../../assets/common/noSwitch.svg';
import fakeSvg from '../../assets/post/fake.svg';
import privacySvg from '../../assets/post/privacy.svg';
import brightFakeSvg from '../../assets/post/bright-fake.svg';
import brightPrivacySvg from '../../assets/post/bright-privacy.svg';
import pauseSvg from '../../assets/post/pause.svg';
import playSvg from '../../assets/post/play.svg';
import editSvg from '../../assets/record/edit.svg';
import rightArrowSvg from '../../assets/post/right_arrow.svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, Categories, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { AllCategory } from '../component/AllCategory';
import VoiceService from '../../services/VoiceService';
import VoicePlayer from "../Home/VoicePlayer";
import { setRefreshState, setVoiceState } from '../../store/actions';
import { MyProgressBar } from '../component/MyProgressBar';
import { DescriptionText } from '../component/DescriptionText';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const PostingVoiceScreen = (props) => {

  const param = props.navigation.state.params;
  let displayDuration = param.recordSecs ? param.recordSecs : param.info.duration;
  let isTemporary = param.isTemporary ? true : false;

  let { user, refreshState, voiceState, socketInstance } = useSelector((state) => state.user);

  let initCategory = 0;
  if (param.info) {
    for (let i = 0; i < Categories.length; i++) {
      if (Categories[i].label == param.info.category) {
        initCategory = i;
        break;
      }
    }
  }

  const { t, i18n } = useTranslation();

  const [category, setCategory] = useState(initCategory);
  const [visibleStatus, setVisibleStatus] = useState(param.info ? param.info.privacy : false);
  const [notSafe, setNotSafe] = useState(false);
  const [temporaryStatus, setTemporaryStatus] = useState(param.info ? param.info.temporary : isTemporary);
  const [visibleReaction, setVisibleReaction] = useState(false);
  const [icon, setIcon] = useState(param.info ? param.info.emoji : "😁");
  const [voiceTitle, setVoiceTitle] = useState(param.info ? param.info.title : '');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShareVoice, setShowShareVoice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [isPlaying, setIsPlaying] = useState(false);
  const [postStep, setPostStep] = useState(0);
  const [warning, setWarning] = useState(false);

  const mounted = useRef(false);

  const scrollRef = useRef();
  const dispatch = useDispatch();

  const dirs = RNFetchBlob.fs.dirs;

  const path = Platform.select({
    ios: `${dirs.CacheDir}/hello.m4a`,
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  const onNavigate = (des, par = null) => {
    const resetActionTrue = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: des, params: par })],
    });
    props.navigation.dispatch(resetActionTrue);
  }

  const selectIcon = (icon) => {
    setIcon(icon);
    setVisibleReaction(false);
  }

  const onChangeCategory = (id) => {
    setCategory(id);
    setSelectedCategory(id);
    scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setShowModal(false);
  }

  const handleSubmit = async () => {
    if (path) {
      let voiceFile = [
        {
          name: 'file', filename: Platform.OS === 'android' ? `${voiceTitle}.mp3` : `${voiceTitle}.m4a`, data: RNFetchBlob.wrap(path)
        },
        { name: 'title', data: voiceTitle },
        { name: 'emoji', data: String(icon) },
        { name: 'duration', data: String(displayDuration) },
        { name: 'category', data: Categories[category].label },
        { name: 'privacy', data: String(visibleStatus) },
        { name: 'notSafe', data: String(notSafe) },
        { name: 'temporary', data: String(temporaryStatus) }
      ];
      setIsLoading(true);
      VoiceService.postVoice(voiceFile).then(async res => {
        const jsonRes = await res.json();
        if (mounted.current) {
          if (res.respInfo.status !== 201) {
          } else {
            socketInstance.emit("newVoice", { uid: user.id });
            //setShowShareVoice(true);
            props.navigation.navigate("ShareStory", { info: jsonRes });
            // dispatch(setRefreshState(!refreshState));
          }
          setIsLoading(false);
        }
      })
        .catch(err => {
          console.log(err);
        });
    }
  }

  const changeStory = async () => {
    const payload = {
      id: param.info.id,
      title: voiceTitle,
      emoji: icon,
      category: Categories[category].label,
      privacy: visibleStatus,
      notSafe: notSafe,
      temporary: temporaryStatus
    };
    setIsLoading(true);
    VoiceService.changeVoice(payload).then(async res => {
      if (mounted.current) {
        if (res.respInfo.status !== 200) {
        } else {
          //  dispatch(setRefreshState(!refreshState));
          let info = param.info;
          info.title = voiceTitle;
          info.emoji = icon;
          info.category = Categories[category].label;
          info.privacy = visibleStatus;
          info.temporary = temporaryStatus;
          onNavigate("VoiceProfile", { id: info.id });
        }
        setIsLoading(false);
      }
    })
      .catch(err => {
        console.log(err);
      });
  }

  const onClickPost = async () => {
    Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
    if (voiceTitle.length == 0 || category == 0) {
      setWarning(true);
      if (voiceTitle.length == 0) setPostStep(0);
      else setPostStep(1);
      return;
    }
    if (param.info)
      changeStory();
    else {
      let post_check = await AsyncStorage.getItem(POST_CHECK);
      if (!post_check) {
        setShowHint(true);
      }
      else {
        handleSubmit();
      }
    }
  }

  useEffect(() => {
    mounted.current = true;
    if (param.info)
      dispatch(setVoiceState(voiceState + 1));
    return () => {
      mounted.current = false;
    }
  }, [])
  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <View
        style={{
          width:windowWidth,
          flex: 1
        }}
      >
        <View style={{ marginTop: Platform.OS == 'ios' ? 50 : 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          <Pressable style={{
            marginLeft: 16,
            position: 'absolute',
            left: 0
          }} onPress={() => postStep == 0 ? props.navigation.goBack() : setPostStep(0)}>
            <SvgXml width="24" height="24" xml={postStep == 0 ? closeBlackSvg : arrowBendUpLeft} />
          </Pressable>

          <MyProgressBar
            dag={2}
            progress={postStep}
          />
        </View>
        {postStep == 0 ? <>
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <TextInput
              placeholder={t("Your title")}
              placeholderTextColor="#3B1F5290"
              color="#281E30"
              textAlign={'center'}
              autoFocus={true}
              value={voiceTitle}
              onChangeText={(s) => { s.length <= 25 ? setVoiceTitle(s) : null; setWarning(false) }}
              fontFamily="SFProDisplay-Regular"
              fontSize={34}
              lineHeight={41}
              marginTop={5}
              letterSpaceing={5}
            />
            {/* <TitleText
            text={`${t("Duration")}: ${displayDuration} ${t("seconds")}`}
            fontFamily="SFProDisplay-Regular"
            fontSize={15}
            lineHeight={24}
            marginTop={7}
            color="rgba(54, 36, 68, 0.8)"
          /> */}
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 50
          }}>
            <TouchableOpacity
              style={{
                paddingLeft: 12,
                paddingRight: 16,
                paddingVertical: 6,
                borderRadius: 20,
                borderColor: visibleStatus ? '#CA83F6' : '#F2F0F5',
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => {
                Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
                setVisibleStatus(!visibleStatus);
              }}
            >
              <SvgXml
                xml={visibleStatus ? brightFakeSvg : fakeSvg}
              />
              <LinearTextGradient
                style={{ fontSize: 17, marginLeft: 8 }}
                locations={[0, 0.4, 1]}
                colors={!visibleStatus ? ["#CF68FF", "#A24EE4", "#4C32EC"] : ["#361252", "#361252", "#361252"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={{ fontFamily: "SFProDisplay-Regular" }}>
                  {t("Only for friends")}
                </Text>
              </LinearTextGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{
              paddingLeft: 12,
              paddingRight: 16,
              paddingVertical: 6,
              borderRadius: 20,
              borderColor: notSafe ? '#CA83F6' : '#F2F0F5',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}
              onPress={() => {
                Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
                setNotSafe(!notSafe);
              }}
            >
              <SvgXml
                xml={notSafe ? brightPrivacySvg : privacySvg}
              />
              <LinearTextGradient
                style={{ fontSize: 17, marginLeft: 8 }}
                locations={[0, 0.4, 1]}
                colors={!notSafe ? ["#CF68FF", "#A24EE4", "#4C32EC"] : ["#361252", "#361252", "#361252"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={{ fontFamily: "SFProDisplay-Regular" }}>
                  {t("NSFW content")}
                </Text>
              </LinearTextGradient>
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 60
          }}>
            {isPlaying ? <VoicePlayer
              key={0}
              voiceUrl={param.info ? param.info.file.url : null}
              playBtn={false}
              replayBtn={false}
              waveColor={user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
              playing={true}
              stopPlay={() => setIsPlaying(false)}
              startPlay={() => { }}
              tinWidth={windowWidth / 170}
              mrg={windowWidth / 400}
              height={70}
              duration={displayDuration * 1000}
            /> : <VoicePlayer
              key={1}
              voiceUrl={param.info ? param.info.file.url : null}
              playBtn={false}
              replayBtn={false}
              waveColor={user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
              playing={false}
              stopPlay={() => { }}
              startPlay={() => { }}
              tinWidth={windowWidth / 170}
              mrg={windowWidth / 400}
              height={80}
              duration={displayDuration * 1000}
            />
            }
          </View>
        </> :
          <>
            <View
              style={{
                alignItems: 'center'
              }}
            >
              <TitleText
                text={t("Select category")}
                textAlign='center'
                maxWidth={280}
                marginTop={43}
              />
              <DescriptionText
                text={t("Select some categories for ...")}
                fontSize={15}
                lineHeight={24}
                textAlign='center'
                maxWidth={320}
                marginTop={8}
              />
            </View>
            <ScrollView style={{ marginTop: 13 }}>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 12,
              }}>
                {Categories.map((item, index) => {
                  if (index == 0)
                    return null;
                  return <TouchableOpacity
                    onPress={() => { setWarning(false); setCategory(index); }}
                    key={index + "topics"}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 12,
                      paddingRight: 16,
                      paddingVertical: 6,
                      marginHorizontal: 4,
                      marginVertical: 4,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#F2F0F5',
                      backgroundColor: index == category ? "#F44685" : '#FFF',
                    }}>
                    <Image
                      source={item.uri}
                      style={{
                        width: 24,
                        height: 24
                      }}
                    />
                    <DescriptionText
                      text={item.label}
                      fontSize={17}
                      lineHeight={28}
                      marginLeft={9}
                      color={index == category ? "#FFF" : "#281E30"}
                    />
                  </TouchableOpacity>
                })}
              </View>
              <View style={{ height: 70, width: 70 }}>
              </View>
            </ScrollView>
          </>
        }
        {postStep == 0 ? <View style={{
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: windowWidth,
          paddingHorizontal: 40,
          height: 95
        }}>
          <TouchableOpacity
            style={{
              height: 56,
              width: 95,
              backgroundColor: '#FFF',
              shadowColor: 'rgba(88, 74, 117, 1)',
              elevation: 10,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying&&<SvgXml
              xml={pauseSvg}
            />}
            {!isPlaying&&<SvgXml
              xml={playSvg}
            />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              voiceTitle == '' ? setWarning(true) : setPostStep(1);
              Platform.OS == 'ios' ? RNVibrationFeedback.vibrateWith(1519) : Vibration.vibrate(100);
            }}
          >
            <LinearGradient
              style={
                {
                  paddingVertical: 13,
                  paddingHorizontal: 29,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row'
                }
              }
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              colors={['#D89DF4', '#B35CF8', '#8229F4']}
            >
              <Text
                style={
                  {
                    color: '#FFF',
                    fontFamily: "SFProDisplay-Semibold",
                    fontSize: 17
                  }
                }
              >
                {t("Next step")}
              </Text>
              <SvgXml
                style={{
                  marginLeft: 2
                }}
                xml={rightArrowSvg}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View> :
          <View
            style={{
              paddingHorizontal: 16,
              width: '100%',
              bottom: 20
            }}
          >
            <MyButton
              label={t("Publish story")}
              loading={isLoading}
              onPress={() => onClickPost()}
            />
          </View>
        }
        {warning && <View style={{
          position: 'absolute',
          top: 40,
          width: windowWidth,
          alignItems: 'center'
        }}>
          <View style={{
            paddingHorizontal: 33,
            paddingVertical: 10,
            backgroundColor: '#E41717',
            borderRadius: 16,
            shadowColor: 'rgba(244, 13, 13, 0.47)',
            elevation: 10,
            shadowOffset: { width: 0, height: 5.22 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
          }}>
            <DescriptionText
              text={voiceTitle == '' ? "Add a title to your story!" : "You must select a category."}
              fontSize={15}
              lineHeight={18}
              color='#FFF'
            />
          </View>
        </View>}
        {visibleReaction &&
          <EmojiPicker
            onEmojiSelected={(icon) => selectIcon(icon.emoji)}
            open={visibleReaction}
            onClose={() => setVisibleReaction(false)} />
        }
        {showHint &&
          <ShareHint
            onCloseModal={() => { setShowHint(false); handleSubmit(); }}
          />}
        {showShareVoice &&
          <ShareVoice
            info={showShareVoice}
            onCloseModal={() => { setShowShareVoice(false); onNavigate("Home"); }}
          />}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
        >
          <Pressable onPressOut={() => setShowModal(false)} style={styles.swipeModal}>
            <AllCategory
              closeModal={() => setShowModal(false)}
              selectedCategory={category}
              setCategory={(id) => onChangeCategory(id)}
            />
          </Pressable>
        </Modal>
        {isLoading &&
          <View style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
            top: 200,
            elevation: 20
          }}>
            <Progress.Circle
              indeterminate
              size={30}
              color="rgba(0, 0, 255, .7)"
              style={{ alignSelf: "center" }}
            />
          </View>
        }
      </View>
      {Platform.OS == 'ios' && <KeyboardSpacer />}
    </KeyboardAvoidingView>
  );
};

export default PostingVoiceScreen;