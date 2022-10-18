import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Progress from "react-native-progress";
import { SvgXml } from 'react-native-svg';

import '../../language/i18n';
import { VoiceItem } from '../component/VoiceItem';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import { windowHeight, windowWidth } from '../../config/config';
import VoiceService from '../../services/VoiceService';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from './MyButton';
import { InviteUsers } from './InviteUsers';
import SelectTopicScreen from '../PhoneNumberLogin/SelectTopicScreen';
import { StoryItem } from '../component/StoryItem';
import { setVisibleOne } from '../../store/actions';
import { StoryPanel } from './StoryPanel';
import { FriendStoryItem } from './FriendStoryItem';

export const FriendStories = ({
  props,
  screenName = '',
  category = '',
  userId = '',
  searchTitle = '',
  recordId = '',
  selectedDay = 0,
  selectedMonth = 0,
}) => {

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const scrollRef = useRef();
  const mounted = useRef(false);

  const [stories, setStories] = useState([]);
  const [LoadMore, setLoadMore] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showInviteList, setShowInviteList] = useState(false);
  const [localKey, setLocalKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [storyPanels, setStoryPanels] = useState([]);

  let { visibleOne, refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const currentVisible = useRef(visibleOne);

  const pageHeight = windowHeight / 814 * 518;

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const OnShowEnd = () => {
    if (showEnd) return;
    setShowEnd(true);
    setTimeout(() => {
      if (mounted.current)
        setShowEnd(false);
    }, 2000);
  }

  const onInsert = ( v )=>{
    let tp=[];
    for(let i=0;i<v.length;i++){
      if((i+1)%80 == 0)
        tp.push({isPopUp:true});
      tp.push(v[i]);
    }
    setStoryPanels([...tp]);
  }

  const getStories = () => {
    setLoading(true);
    const currentYear = new Date().getFullYear();
    VoiceService.getStories(0, userId, category, searchTitle, recordId, 'friend', 10, `${currentYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        setStories([...jsonRes]);
        setLoading(false);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const onRefresh = () => {
    setRefreshing(true);
    getStories(true);
    setTimeout(() => {
      if (mounted.current)
        setRefreshing(false)
    }, 1000);
  };

  useEffect(() => {
    if (selectedMonth && selectedDay) {
      getStories();
    }
  }, [])

  useEffect(() => {
    if (selectedMonth && selectedDay) {
      getStories()
    }
  }, [selectedDay, selectedMonth])

  const onChangeLike = (id, val) => {
    let tp = [...stories];
    let item = tp[id].isLike;
    if (item == true && val == false) {
      tp[id].likesCount--;
    }
    else if (item == false && val == true) {
      tp[id].likesCount++;
    }
    tp[id].isLike = val;
    setStories([...tp]);
  }

  const storyItems = useMemo(() => {
    return <FlatList
      style={{ width: windowWidth, height: pageHeight, paddingTop: 22 }}
      horizontal={true}
      pagingEnabled={true}
      ref={scrollRef}
      data={stories}
      renderItem={({ item, index }) => {
        return <FriendStoryItem
          key={index + item.id}
          props={props}
          itemIndex={index}
          info={item}
          height={pageHeight}
          storyLength={stories.length}
          onMoveNext={(index1) => {
            scrollRef.current?.scrollToIndex({ animated: true, index: index1 })
          } }
          onChangeLike={(isLiked) => onChangeLike(index, isLiked)}
        />
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  }, [stories, selectedDay, selectedMonth])

  return <View style={{ height: pageHeight }}>
    {(stories.length > 0 ? storyItems :
    (!loading ?
      <View style={{ alignItems: 'center', justifyContent: "center", width: windowWidth, height: pageHeight }}>
        <SvgXml
          xml={box_blankSvg}
        />
        <DescriptionText
          text={t("No friend stories")}
          fontSize={17}
          lineHeight={28}
          marginTop={22}
        />
      </View>
      : null)
          )}
    {loading &&
      <View style={{
        position: stories.length ? 'absolute' : 'relative',
        width: '100%',
        alignItems: 'center',
        marginTop: 100,
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
    {/* {showInviteList &&
      <InviteUsers
        props={props}
        onCloseModal={() => setShowInviteList(false)}
      />
    } */}
  </View>
};
