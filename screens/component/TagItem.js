import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { TitleText } from "./TitleText";
import { DescriptionText } from "./DescriptionText";
import { useSelector } from 'react-redux';
import { HeartIcon } from './HeartIcon';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { styles } from '../style/Common';
import VoiceService from "../../services/VoiceService";
import { Avatars, windowWidth } from "../../config/config";
import { TagUserList } from "./TagUserList";

export const TagItem = ({
  info,
  props,
  onChangeIsLiked = () => { },
}) => {

  const { user } = useSelector((state) => state.user);

  const [tagUsers, setTagUsers] = useState([]);
  const [delayTime, setDelayTime] = useState(null);
  const [showList, setShowList] = useState(false);

  const { t, i18n } = useTranslation();
  const [lastTap, setLastTap] = useState(0);
  let userName = info.user.name,
    check = info.isLiked;

  const DOUBLE_PRESS_DELAY = 400;

  const onLikeTag = () => {
    VoiceService.likeTag(info.id, !check);
    onChangeIsLiked();
  }

  const onClickDouble = () => {
    const timeNow = Date.now();
    if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(delayTime);
      onLikeTag();
    } else {
      setLastTap(timeNow);
      setDelayTime(setTimeout(() => {
        setShowList(true);
        setLastTap(0);
      }, DOUBLE_PRESS_DELAY));
    }
  };

  const getTagUsers = () => {
    VoiceService.getTagUsers(info.id).then(async res => {
      const jsonRes = await res.json();
      if (res.respInfo.status === 200) {
        setTagUsers(jsonRes);
      }
    })
  }

  const onLimit = (v) => {
    return ((v).length > 8) ?
      (((v).substring(0, 5)) + '...') :
      v;
  }

  useEffect(() => {
    getTagUsers();
  }, [])

  return (<>
    <TouchableOpacity
      style={{
        marginBottom: 3,
        paddingHorizontal: 24,
        paddingTop: 10,
        width: windowWidth,
        paddingBottom: 10,
        backgroundColor: '#FFF',
      }}
      onPress={() => onClickDouble()}
    >
      <View
        style={[styles.rowSpaceBetween]}
      >
        <View style={styles.rowAlignItems}>
          <TouchableOpacity onPress={() => info.user.id == user.id ? props.navigation.navigate('Profile') : props.navigation.navigate('UserProfile', { userId: info.user.id })}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderColor: '#FFA002',
                borderWidth: info.user.premium == 'none' ? 0 : 2
              }}
              source={ info.user.avatar?{ uri: info.user.avatar.url }:Avatars[info.user.avatarNumber].uri}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 16 }}>
            <TitleText
              text={userName}
              fontSize={15}
              lineHeight={24}
            />
            <View style={{ marginTop: 2, height: 16, flexDirection: 'row' }}>
              {tagUsers.map((item, index) => {
                return (index < 2) ?
                  <View key={item.id + "tagUser"} style={styles.rowAlignItems}>
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        borderColor: '#FFA002',
                        borderWidth: item.premium == 'none' ? 0 : 1
                      }}
                      source={item.avatar?{ uri: item.avatar.url }:Avatars[item.avatarNumber].uri}
                    />
                    <DescriptionText
                      text={'@' + onLimit(item.name)}
                      fontSize={12}
                      lineHeight={16}
                      marginLeft={8}
                      marginRight={20}
                    //    color='rgba(59, 31, 82, 0.6)'
                    />
                  </View> : null
              })}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HeartIcon
            isLike={check}
            marginRight={33}
            OnSetLike={() => onLikeTag()}
          />
          <View style={{ marginRight: 11, width: 19, height: 19 }}>
            {tagUsers.length > 0 && <TouchableOpacity onPress={() => setShowList(true)} style={{ alignItems: 'center', justifyContent: 'center', width: 19, height: 19, borderRadius: 9.5, backgroundColor: '#7F27D3' }}>
              <DescriptionText
                text={tagUsers.length}
                color='#FFF'
                lineHeight={17}
                fontSize={12.5}
              />
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
    {showList &&
      <TagUserList
        props={props}
        users={tagUsers}
        onCloseModal={() => setShowList(false)}
      />
    }
  </>
  );
};
