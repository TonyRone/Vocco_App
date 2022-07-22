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
  Modal
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { NavigationActions, StackActions } from 'react-navigation';
import { TitleText } from '../component/TitleText';

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
import editSvg from '../../assets/record/edit.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, Categories, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { AllCategory } from '../component/AllCategory';
import VoiceService from '../../services/VoiceService';
import VoicePlayer from "../Home/VoicePlayer";
import { setRefreshState, setVoiceState } from '../../store/actions';

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
  const [temporaryStatus, setTemporaryStatus] = useState(param.info ? param.info.temporary : isTemporary);
  const [visibleReaction, setVisibleReaction] = useState(false);
  const [icon, setIcon] = useState(param.info ? param.info.emoji : "😁");
  const [voiceTitle, setVoiceTitle] = useState(param.info ? param.info.title : '');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShareVoice, setShowShareVoice] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initCategory);

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
    const post_check = await AsyncStorage.getItem(POST_CHECK);
    if (!post_check) {
      setShowHint(true);
      return;
    }
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
            props.navigation.navigate("ShareStory", {info:jsonRes});
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

  useEffect(() => {
    mounted.current = true;
    if (param.info)
      dispatch(setVoiceState(voiceState + 1));
    return ()=>{
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
      <View style={{ width: windowWidth, height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#F8F0FF' }}>
        <View style={{ marginTop: Platform.OS == 'ios' ? 50 : 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          <Pressable style={{
            marginLeft: 16,
            position: 'absolute',
            left: 0
          }} onPress={() => props.navigation.goBack()}>
            <SvgXml width="24" height="24" xml={closeBlackSvg} />
          </Pressable>

          <TitleText
            text={param.info ? t("Change your story") : t("Share your story")}
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
            placeholder={t("Title of your story")}
            placeholderTextColor="#3B1F5290"
            color="#281E30"
            textAlign={'center'}
            value={voiceTitle}
            onChangeText={(s) => s.length <= 25 ? setVoiceTitle(s) : null}
            fontFamily="SFProDisplay-Regular"
            fontSize={28}
            lineHeight={34}
            marginTop={5}
            letterSpaceing={5}
          />
          <TitleText
            text={`${t("Duration")}: ${displayDuration} ${t("seconds")}`}
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
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 10,
            borderRadius: 16,
            marginHorizontal: 16,
          }}
        >
          <VoicePlayer
            voiceUrl={param.info ? param.info.file.url : null}
            playBtn={true}
            replayBtn={true}
            waveColor={user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
            playing={false}
            stopPlay={() => { }}
            startPlay={() => { }}
            duration={displayDuration * 1000}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TitleText
            text={t("Select category")}
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
              text={t('SEE ALL')}
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
        <FlatList
          horizontal={true}
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          style={[{ marginLeft: 12 }, styles.mt16]}
          data={Categories}
          renderItem={({ item, index }) => {
            let idx = 0;
            if (selectedCategory > 0) {
              if (index == 0) idx = selectedCategory;
              else if (index <= selectedCategory) idx = index - 1;
              else idx = index;
            }
            else idx = index;
            return <CategoryIcon
              key={'category' + idx}
              label={Categories[idx].label}
              source={Categories[idx].uri}
              onPress={() => setCategory(idx)}
              active={category == idx ? true : false}
            />
          }}
          keyExtractor={(item, idx) => idx.toString()}
        />
        <TitleText
          text={t("Privacy settings")}
          fontFamily="SFProDisplay-Regular"
          fontSize={15}
          lineHeight={24}
          marginTop={20}
          marginLeft={16}
          marginBottom={9}
          color="rgba(54, 36, 68, 0.8)"
        />
        <View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 12, marginBottom: 5 }]}>
          <TitleText
            text={t("Only visible to friends")}
            fontSize={17}
            lineHeight={28}
            color="#281E30"
          />
          <TouchableOpacity onPress={() => setVisibleStatus(!visibleStatus)}>
            <SvgXml
              width={55}
              height={35}
              xml={visibleStatus ? yesSwitchSvg : noSwitchSvg}
            />
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
        {/* <View style={[styles.rowSpaceBetween, { paddingLeft: 16, paddingRight: 12, marginBottom: 30 }]}>
          <TitleText
            text={t("Temporary Story")}
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
        </View> */}
=======
>>>>>>> 89a5dcbb7d33a47c348fcbe418ac18bf320b2698
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
          bottom: 20
        }}
      >
        <MyButton
          label={param.info ? t("Change my story") : t("Share my story")}
          loading={isLoading}
          onPress={param.info ? changeStory : handleSubmit}
          active={voiceTitle != ''}
        />
      </View>
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
    </KeyboardAvoidingView>
  );
};

export default PostingVoiceScreen;