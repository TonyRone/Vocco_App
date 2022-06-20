import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../language/i18n';
import { TitleText } from '../component/TitleText';
import { FlatList } from 'react-native-gesture-handler';
import SwipeDownModal from 'react-native-swipe-down';
import { CategoryIcon } from '../component/CategoryIcon';
import { RecordIcon } from '../component/RecordIcon';
import { DescriptionText } from '../component/DescriptionText';
import { BottomButtons } from '../component/BottomButtons';
import { AllCategory } from '../component/AllCategory';
import VoiceService from '../../services/VoiceService';

import { SvgXml } from 'react-native-svg';
import notificationSvg from '../../assets/discover/notification.svg';
import searchSvg from '../../assets/login/search.svg';

import { Categories, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { Stories } from '../component/Stories';

const DiscoverScreen = (props) => {

  const [category, setCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const [notify, setNotify] = useState(false);

  const scrollRef = useRef();

  let { refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const { t, i18n } = useTranslation();

  const onSetCategory = (categoryId) => {
    setLoadKey(0);
    setCategory(categoryId);
  }

  const onChangeCategory = (id) => {
    onSetCategory(id);
    setSelectedCategory(id);
    scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setShowModal(false);
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const getNewNotifyCount = () => {
    VoiceService.unreadActivityCount().then(async res => {
      if (res.respInfo.status == 201) {
        const jsonRes = await res.json();
        if (jsonRes.count > 0)
          setNotify(true);
        else {
          VoiceService.unreadRequestCount().then(async res => {
            if (res.respInfo.status == 201) {
              const jsonRes = await res.json();
              if (jsonRes.count > 0)
                setNotify(true);
              else
                setNotify(false);
            }
          })
            .catch(err => {
              console.log(err);
            });
        }
      }
    })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    getNewNotifyCount();
  }, [refreshState])

  return (
    <KeyboardAvoidingView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <View
        style={[
          { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 20, marginBottom: 20, height: 30 },
          styles.rowJustifyCenter
        ]}
      >
        <TitleText
          text={t("Discover")}
          fontSize={20}
          color="#281E30"
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 20
          }}
          onPress={() => props.navigation.navigate('Notification')}
        >
          <SvgXml
            width="24"
            height="24"
            xml={notificationSvg}
          />
          {notify == true && <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              marginLeft: 6, borderWidth: 2,
              borderColor: '#FFF',
              backgroundColor: '#D82783'
            }}
          >
          </View>}
        </TouchableOpacity>

      </View>

      <View style={[styles.paddingH16]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SvgXml
            width="20"
            height="20"
            xml={searchSvg}
            style={styles.searchIcon}
          />
          <Pressable
            style={styles.searchBox}
            onPress={() => {
              props.navigation.navigate("Search");
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: 'grey'
              }}
            >{t("Search") + '...'}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={{ marginBottom: Platform.OS == 'ios' ? 65 : 75, marginTop: 25 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setLoadKey(loadKey + 1);
          }
        }}
        scrollEventThrottle={400}
      >
        <View
          style={[styles.paddingH16, styles.rowSpaceBetween]}
        >
          <TitleText
            text={t("Top categories")}
            fontSize={20}
          />
          <TouchableOpacity
            onPress={() => {
              setShowModal(true);
            }}
          >
            <DescriptionText
              text={t("SEE ALL")}
              fontSize={13}
              color='#281E30'
            />
          </TouchableOpacity>
        </View>
        <View>
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
                onPress={() => onSetCategory(idx)}
                active={category == idx ? true : false}
              />
            }}
            keyExtractor={(item, idx) => idx.toString()}
          />
        </View>
        <TitleText
          text={t("World stories")}
          fontSize={20}
          marginTop={10}
          marginLeft={16}
        />
        <Stories
          props={props}
          loadKey={loadKey}
          screenName="Discover"
          category={Categories[category].label}
        />
      </ScrollView>
      <SwipeDownModal
        modalVisible={showModal}
        ContentModal={
          <AllCategory
            closeModal={() => setShowModal(false)}
            selectedCategory={category}
            setCategory={(id) => onChangeCategory(id)}
          />
        }
        ContentModalStyle={styles.swipeModal}
        onRequestClose={() => { setShowModal(false) }}
        onClose={() => {
          setShowModal(false);
        }}
      />
      <BottomButtons
        active='global'
        props={props}
      />
      <RecordIcon
        props={props}
        bottom={15.5}
        left={windowWidth / 2 - 27}
      />
    </KeyboardAvoidingView>
  );
};

export default DiscoverScreen;