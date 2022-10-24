import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Share from 'react-native-share';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import LinearGradient from "react-native-linear-gradient";

import '../../language/i18n';
import { FeedStories } from './FeedStories';
import { Categories, windowWidth, Days, Months } from '../../config/config';
import { TemporaryStories } from './TemporaryStories';
import { setUser } from '../../store/actions';
import { FriendStories } from './FriendStories';
import { styles } from '../style/Common';
import { SemiBoldText } from './SemiBoldText';
import { DescriptionText } from './DescriptionText';
import VoiceService from '../../services/VoiceService';

import ShareSvg from '../../assets/friend/share.svg';
import DropdownSvg from '../../assets/Feed/monthdown.svg';

export const Feed = ({
  props,
  category = 0,
}) => {


  const mounted = useRef(false);
  const current_Month = new Date().getMonth();

  const { t, i18n } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [monthDate, setMonthDate] = useState([]);
  const scrollRef = useRef();
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

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
    const currentDate = new Date();
    setSelectedDay(currentDate.getDate());
    setSelectedMonth(currentDate.getMonth() + 1);

    mounted.current = true;
    let tp = user;
    tp.lastSee = new Date();
    dispatch(setUser(tp));
    return () => {
      mounted.current = false;
    }
  }, []);

  useEffect(() => {
    if (selectedMonth > 0) {
      let month_dates = [];
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      let daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
      if (selectedMonth === currentMonth + 1) {
        daysInMonth = new Date().getDate();
      }
      for (let i = 1; i <= daysInMonth; i++) {
        let dayName = Days[new Date(`${currentYear}/${selectedMonth}/${i}`).getDay()];
        month_dates.push({
          date: i,
          day: dayName
        });
      }

      setMonthDate([...month_dates]);
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth])

  // useEffect(() => {
  //   if (selectedMonth && selectedDay) {
  //     VoiceService.getStories(0, '', '', '', '', 'friend', 10, `2022-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
  //   }
  // }, [selectedMonth, selectedDay])

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        width: windowWidth,
        flex: 1,
      }}
    >
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
      <View style={{ flexDirection : "row", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 10 }}>
        <Text style={{ fontWeight: "700", fontSize: 18, lineHeight: 26, color: "#000000" }}>{t('Moments')}</Text>
        <View style={{ position: "relative", zIndex: 10 }}>
          <TouchableOpacity onPress={() => setShowMonthDropdown(!showMonthDropdown)}>
            <View style={{ flexDirection: "row", alignItems: "center", width: 75, justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "700", fontSize: 12, lineHeight: 26, color: "#858585" }}>{ t(Months[selectedMonth - 1]) }</Text>
              <SvgXml xml={DropdownSvg} />
            </View>
          </TouchableOpacity>
          { showMonthDropdown &&
            <ScrollView style={{ position: "absolute", width: "100%", top: 25, height: 100, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#858585", zIndex: 20, overflow: "scroll" }}>
              {
                Months.map((item, index) => {
                  if (index <= current_Month) {
                    return <TouchableOpacity
                          key={index}
                          style={{
                            paddingVertical: 3,
                            backgroundColor: index === selectedMonth - 1 ? "#000000" : "#FFFFFF",
                            zIndex: 20,
                          }}
                          onPress={() => {
                            setSelectedMonth(index + 1);
                            setShowMonthDropdown(false);
                          }}
                        >
                          <Text style={{ color: index === selectedMonth - 1 ? "#FFFFFF" : "#858585", fontSize: 12 }}>{item}</Text>
                        </TouchableOpacity>
                  }
                })
              }
            </ScrollView>
          }
        </View>
      </View>
      <View style={{ width: windowWidth, paddingHorizontal: 20, marginTop: 24, zIndex: 0, position: "relative" }}>
        <FlatList
          style={{ zIndex: 0 }}
          horizontal={true}
          ref={scrollRef}
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({ animated: true })
          }}
          showsHorizontalScrollIndicator={false}
          data={monthDate}
          keyExtractor={(item) => item.date + item.day}
          renderItem={({item}) => (
            <View style={{ flexDirection: "column", alignItems: "center", zIndex: 0, width: (windowWidth - 40) / 7 }}>
              <Text style={{ fontWeight: "500", fontSize: 12, lineHeight: 12, color: "#A8A8A8", zIndex: 0 }}>{ t(item.day) }</Text>
              <TouchableOpacity style={{ marginTop: item.date === selectedDay ? 2 : 3 , zIndex: 0}} onPress={() => setSelectedDay(item.date)}>
                <LinearGradient
                  style={{ width: 29, height: 29, borderRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", zIndex: 0 }}
                  colors={ item.date === selectedDay ? [ '#D596F5', '#8A31F6' ] : ['#FFFFFF', '#FFFFFF']}
                >
                  <Text style={{ fontWeight: "500", fontSize: 16, lineHeight: 16, color: item.date === selectedDay ? '#FFFFFF' : '#000000' }}>{ item.date }</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) }
        />
      </View>
      <FriendStories
        props={props}
        screenName="Feed"
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        setSelectedDay={(day) => setSelectedDay(day)}
        setSelectedMonth={(month) => setSelectedMonth(month)}
      />
      {/* </ScrollView> */}
    </View>
  );
};
