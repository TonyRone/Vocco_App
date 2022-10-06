import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';


import { FeedStories } from './FeedStories';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { Categories, windowWidth } from '../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import { TemporaryStories } from './TemporaryStories';
import { setUser } from '../../store/actions';
import { DiscoverStories } from './Discoverstories';
import { styles } from '../style/Common';
import { SemiBoldText } from './SemiBoldText';
import { DescriptionText } from './DescriptionText';
import ShareSvg from '../../assets/friend/share.svg';
import Share from 'react-native-share';
import { SvgXml } from 'react-native-svg';

export const Feed = ({
  props,
  category = 0,
}) => {


  const mounted = useRef(false);

  const { t, i18n } = useTranslation();


  let { user } = useSelector((state) => {
    return (
      state.user
    )
  });

  const dispatch = useDispatch();

  const onShareLink = () => {
    Share.open({
      url: `https://vocco.app.link/${user.name}`,
    }).then(res => {

    })
      .catch(err => {
        console.log("err");
      });
  }

  useEffect(() => {
    mounted.current = true;
    let tp = user;
    tp.lastSee = new Date();
    dispatch(setUser(tp));
    return () => {
      mounted.current = false;
    }
  }, [])

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        width: windowWidth,
        flex: 1,
      }}
    >
      <TouchableOpacity
        style={[styles.rowSpaceBetween, { backgroundColor: '#F8F0FF', paddingVertical: 8, paddingHorizontal: 16, marginBottom: 6 }]}
        onPress={() => onShareLink()}
      >
        <View style={styles.rowAlignItems}>
          <Image
            source={user.avatar ? { uri: user.avatar.url } : Avatars[user.avatarNumber].uri}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
          />
          <View style={{
            marginLeft: 12
          }}>
            <SemiBoldText
              text={t("Invite friends")}
              fontSize={15}
              lineHeight={24}
            />
            <DescriptionText
              text={'vocco.ai/' + user.name}
              fontSize={13}
              lineHeight={21}
            />
          </View>
        </View>
        <SvgXml
          xml={ShareSvg}
        />
      </TouchableOpacity>
      <DiscoverStories
        props={props}
        screenName="Feed"
      />
      {/* </ScrollView> */}
    </View>
  );
};
