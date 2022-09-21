import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform,
  RefreshControl,
  Modal,
  Image
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import '../../language/i18n';
import { TitleText } from './TitleText';
import { FlatList } from 'react-native-gesture-handler';
import { CategoryIcon } from './CategoryIcon';
import { DescriptionText } from './DescriptionText';
import { AllCategory } from './AllCategory';

import { SvgXml } from 'react-native-svg';
import searchSvg from '../../assets/login/search.svg';

import { Categories, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { Stories } from './Stories';
import { DiscoverStories } from './Discoverstories';
import { setRefreshState } from '../../store/actions';

export const Discover = ({
  props,
}) => {

  const [category, setCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useRef();
  const mounted = useRef(false);

  let { refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const onRefresh = () => {
    setRefreshing(true);
    setLoadKey(loadKey - 1);
    setTimeout(() => {
      if(mounted.current)
        setRefreshing(false)
    }, 1000);
  };

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
    mounted.current = true;
    return ()=>{
      mounted.current = false;
    }
  }, [refreshState])

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        width: windowWidth,
        flex: 1
      }}
    >
      <View style={[styles.paddingH16, {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-start"
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: windowWidth / 375 * 14}}>
          <View
            style={{
              height: windowWidth / 375 * 43,
              alignItems: 'center',
              justifyContent: 'center',
              width: windowWidth / 375 * 43,
              borderRadius: 12,
              backgroundColor: (category == selectedCategory ? true : false) ? '#B35CF8' : '#FFF',
              shadowColor: 'rgba(42, 10, 111, 1)',
              elevation: !(category == selectedCategory ? true : false) ? 10 : 0,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4
            }}
          >
            <TouchableOpacity
              style={{
                width: windowWidth / 375 * 43,
                alignItems: 'center',
                padding: 1,
                borderRadius: 12,
              }}
              onPress={() => setShowModal()}
            >
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                color: '#4C64FF',
                backgroundColor: '#FFF',
                padding: 15,
                width: windowWidth / 375 * 43 - 4,
                height: windowWidth / 375 * 43 - 4,
                borderRadius: 10,
              }}>
                <Image source={Categories[selectedCategory].uri}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "SFProDisplay-Regular",
              letterSpacing: 0.066,
              color: '#A24EE4',
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {Categories[selectedCategory].label == '' ? t('All') :  t(Categories[selectedCategory].label)}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      {/* <ScrollView
        style={{ flex:1, marginBottom: Platform.OS == 'ios' ? 65 : 75 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setLoadKey(loadKey + 1);
          }
        }}
        scrollEventThrottle={400}
      > */}
        {/* <View
          style={[styles.paddingH16, styles.rowSpaceBetween,{marginTop:25}]}
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
        </View> */}
        {/* <TitleText
          text={t("World stories")}
          fontSize={20}
          marginTop={10}
          marginLeft={16}
        /> */}
        <DiscoverStories
          props={props}
          loadKey={loadKey}
          category={Categories[category].label}
        />
      {/* </ScrollView> */}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <Pressable style={styles.swipeModal}>
          <AllCategory
            closeModal={() => setShowModal(false)}
            selectedCategory={category}
            setCategory={(id) => onChangeCategory(id)}
          />
        </Pressable>
      </Modal>
    </View>
  );
};
