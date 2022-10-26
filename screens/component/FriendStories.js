import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity
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
import { FriendStoryItems } from './FriendStoryItems';
import { DailyPopUp } from './DailyPopUp';

export const FriendStories = ({
  props,
  screenName = '',
  category = '',
  userId = '',
  searchTitle = '',
  recordId = '',
  selectedDay = 0,
  selectedMonth = 0,
  setSelectedDay = () => {},
  setSelectedMonth = () => {}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [beforeIndex, setBeforeIndex] = useState(-1);
  const [dailyPop, setDailyPop] = useState(false);

  let { visibleOne, refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const currentVisible = useRef(visibleOne);

  const pageHeight = windowHeight / 814 * 546;

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
  
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.nativeEvent.locationX);
  }
  
  const onTouchMove = (e) => setTouchEnd(e.nativeEvent.locationX)
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe || isRightSwipe) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      if (isLeftSwipe) {
        if (selectedMonth == currentMonth) {
          if (selectedDay < currentDay) {
            setSelectedDay(selectedDay + 1);
          }
        } else {
          const specific_days = new Date(currentYear, selectedMonth, 0).getDate();
          if (selectedDay < specific_days) {
            setSelectedDay(selectedDay + 1);
          } else {
            setSelectedMonth(selectedMonth + 1);
            setSelectedDay(1);
          }
        }
      } else {
        if (selectedMonth > 1) {
          if (selectedDay > 1) {
            setSelectedDay(selectedDay - 1);
          } else {
            const specific_days = new Date(currentYear, selectedMonth - 1, 0).getDate();
            setSelectedMonth(selectedMonth - 1);
            setSelectedDay(specific_days);
          }
        } else {
          if (selectedDay > 1) {
            setSelectedDay(selectedDay - 1);
          }
        }
      }
    }
    // add your conditional logic here
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
  const renderFooter=()=>{
    return(
    <View style={{ backgroundColor: "#00FF00" }}>
      <Text style={{ color: "#FF0000" }}>End of the Line!</Text>
    </View>
    )
  }

  const storyItems = useMemo(() => {
    return <FlatList
      style={{ width: windowWidth, height: pageHeight, paddingTop: windowHeight / 812 * 17 }}
      horizontal={true}
      pagingEnabled={true}
      ref={scrollRef}
      data={stories}
      onMomentumScrollBegin={(event) => {
        console.log(event.nativeEvent);
      }}
      // onScrollEndDrag={(event) => {
      //   console.log(event.nativeEvent);
      // }}
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
      <View style={{ alignItems: 'center', justifyContent: "center", width: windowWidth, height: pageHeight }} onTouchStart={(e) => onTouchStart(e)} onTouchEnd={onTouchEnd} onTouchMove={(e) => onTouchMove(e)} >
        <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "white", position: "relative" }}>
          <SvgXml
            xml={box_blankSvg}
          />
          <DescriptionText
            text={t("No friend stories")}
            fontSize={17}
            lineHeight={28}
            marginTop={22}
          />
          <View style={{ position: "absolute", bottom: 70, width: "100%", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ padding: 14, borderRadius: 14, backgroundColor: "#F8F0FF" }} onPress={() => setDailyPop(true)}>
              <Text style={{ fontWeight: "500", fontSize: 17, lineHeight: 28, color: "#8327D8" }}>{t("Share a moment that happened on that day")}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    {dailyPop && 
      <DailyPopUp
        props={props}
        onCloseModal={() => setDailyPop(false)}
        createdAt={`${new Date().getFullYear()}-${selectedMonth}-${selectedDay}`}
      />}
  </View>
};
