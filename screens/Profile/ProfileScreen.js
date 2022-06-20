import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  Platform
} from 'react-native';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { BottomButtons } from '../component/BottomButtons';
import LinearGradient from 'react-native-linear-gradient';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import editSvg from '../../assets/common/edit.svg';
import boxbackArrowSvg from '../../assets/profile/box_backarrow.svg';
import { useSelector } from 'react-redux';
import { styles } from '../style/Common';
import VoiceService from '../../services/VoiceService';
import { PostContext } from '../component/PostContext';
import { windowWidth } from '../../config/config';
import { Stories } from '../component/Stories';
import { TemporaryStories } from '../component/TemporaryStories';
import { RecordIcon } from '../component/RecordIcon';
import { FollowUsers } from '../component/FollowUsers';

const ProfileScreen = (props) => {

  let { user, refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  console.log(user.id);

  const { t, i18n } = useTranslation();

  let userData = { ...user };
  const [voices, setVoices] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadMore, setLoadMore] = useState(10);
  const [showEnd, setShowEnd] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const [allFollows, setAllFollows] = useState("");

  if (props.navigation.state.params)
    () => setRefresh(!refresh);

  const getUserVoices = () => {
    if (loadMore < 10) {
      onShowEnd();
      return;
    }
 
    VoiceService.getUserVoice(userData.id, voices.length).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        if (jsonRes.length > 0)
          setVoices(voices.length == 0 ? jsonRes : [...voices, ...jsonRes]);
        setLoadMore(jsonRes.length);
      }
    })
      .catch(err => {
        console.log(err);
      });
  }
  const getUserInfo = () => {
    VoiceService.getProfile(userData.id).then(async res => {
      if (res.respInfo.status == 200) {
        const jsonRes = await res.json();
        setUserInfo(jsonRes);
      }
    })
      .catch(err => {
        console.log(err);
      });
  }

  const renderName = (fname, lname) => {
    let fullname = '';
    if (fname)
      fullname = fname;
    if (lname) {
      if (fname) fullname += ' ';
      fullname += lname;
    }
    return fullname
  }
  const setLiked = () => {
    let tp = voices;
    let item = tp[selectedIndex].isLike;
    if (item)
      tp[selectedIndex].likesCount--;
    else
      tp[selectedIndex].likesCount++;
    tp[selectedIndex].isLike = !tp[selectedIndex].isLike;
    setVoices(tp);
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  const onShowEnd = () => {
    if (showEnd) return;
    setShowEnd(true);
    setTimeout(() => {
      setShowEnd(false);
    }, 2000);
  }

  useEffect(() => {
    getUserVoices();
    getUserInfo();
  }, [refreshState])
  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <Image
        source={{ uri: userData.avatar?.url }}
        resizeMode="cover"
        style={[styles.topProfileContainer, {
          width: windowWidth + (userData.premium == "none" ? 0 : 6),
          height: 350 + (userData.premium == "none" ? 0 : 6),
          borderBottomLeftRadius: 45 + (userData.premium == "none" ? 0 : 3),
          borderWidth: userData.premium == "none" ? 0 : 3,
          marginLeft: userData.premium == "none" ? 0 : -3,
          marginTop: userData.premium == "none" ? 0 : -3,
          borderColor: '#FFA002'
        }]}
      />
      <Pressable style={{ position: 'absolute', top: 0 }} onLongPress={() => props.navigation.navigate('Photo', { imageUrl: userData.avatar?.url, backPage: 'Profile' })}>
        <LinearGradient
          colors={['rgba(52, 50, 56, 0)', 'rgba(42, 39, 47, 0)', 'rgba(39, 36, 44, 0.65)', 'rgba(34, 32, 38, 0.9)']}
          locations={[0, 0.63, 0.83, 1]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={[
            styles.topProfileContainer,
            {
              paddingBottom: 17,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'flex-end',

            }
          ]}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ position: 'absolute', left: 0, top: Platform.OS == 'ios' ? 24 : 12 }}>
            <SvgXml
              xml={boxbackArrowSvg}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Voices")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.voices?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </View>
          <TouchableOpacity onPress={() => setAllFollows("Followers")} style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Followers")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.followers?.count}
              fontFamily="SFProDisplay-Bold"
              fontSize={22}
              lineHeight={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAllFollows("Following")} style={{ alignItems: 'center' }}>
            <DescriptionText
              text={t("Following")}
              fontSize={12}
              lineHeight={16}
              color="#F6EFFF"
            />
            <TitleText
              text={userInfo.followings?.count}
              fontSize={22}
              fontFamily="SFProDisplay-Bold"
              lineHeight={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </LinearGradient>
      </Pressable>
      <TemporaryStories
        props={props}
        userId={user.id}
      />
      <ScrollView
        style={{ marginBottom: Platform.OS == 'ios' ? 65 : 75, marginTop: 16 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setLoadKey(loadKey + 1);
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.paddingH16}>
          <View style={styles.rowSpaceBetween}>
            <View>
              <View style={styles.rowAlignItems}>
                <TitleText
                  text={userData.name}
                  fontFamily="SFProDisplay-Bold"
                  lineHeight={33}
                />
                <Pressable disabled={userData.premium != 'none'} onPress={() => props.navigation.navigate("Premium")}>
                  <Image
                    style={{
                      width: 100,
                      height: 33,
                      marginLeft: 16
                    }}
                    source={require('../../assets/common/premiumstar.png')}
                  />
                </Pressable>
              </View>
            </View>
            <View style={[styles.contentCenter, { height: 40, width: 40, borderRadius: 20, backgroundColor: '#F8F0FF' }]}>
              <TouchableOpacity onPress={() => props.navigation.navigate('EditProfile')}>
                <SvgXml
                  width={18}
                  height={18}
                  xml={editSvg}
                />
              </TouchableOpacity>
            </View>
          </View>
          {user.bio && <DescriptionText
            numberOfLines={3}
            marginTop={15}
            text={user.bio}
          />}
          <TitleText
            text={t('Your voices')}
            fontSize={20}
            marginTop={21}
            marginBottom={3}
          />
        </View>
        <Stories
          props={props}
          loadKey={loadKey}
          screenName="Profile"
          userId={user.id}
        />
      </ScrollView>
      <BottomButtons
        active='profile'
        props={props}
      />
      {showContext &&
        <PostContext
          postInfo={voices[selectedIndex]}
          props={props}
          onChangeIsLike={() => setLiked()}
          onCloseModal={() => setShowContext(false)}
        />
      }
      {allFollows != '' &&
        <FollowUsers
          props={props}
          userId={user.id}
          followType={allFollows}
          onCloseModal={() => setAllFollows('')}
        />
      }
      <RecordIcon
        props={props}
        bottom={15.5}
        left={windowWidth / 2 - 27}
      />
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;