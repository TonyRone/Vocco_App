import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../language/i18n';
import { TitleText } from './TitleText';
import { FlatList } from 'react-native-gesture-handler';
import SwipeDownModal from 'react-native-swipe-down';
import { CategoryIcon } from './CategoryIcon';
import { DescriptionText } from './DescriptionText';
import { AllCategory } from './AllCategory';

import { SvgXml } from 'react-native-svg';
import searchSvg from '../../assets/login/search.svg';

import { Categories, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { Stories } from './Stories';

export const Discover = ({
  props,
}) => {

  const [category, setCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

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

  useEffect(() => {
  }, [refreshState])

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        width: windowWidth,
        flex: 1
      }}
    >
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
    </View>
  );
};
