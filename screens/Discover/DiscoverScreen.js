import React, { useState, useEffect, useRef, useReducer } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TouchableOpacity, 
  Pressable,
  ScrollView,
  Image
} from 'react-native';

import * as Progress from "react-native-progress";
import {useTranslation} from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../language/i18n';
import { TitleText } from '../component/TitleText';
import { FlatList } from 'react-native-gesture-handler';
import SwipeDownModal from 'react-native-swipe-down';
import { CategoryIcon } from '../component/CategoryIcon';
import { DescriptionText } from '../component/DescriptionText';
import { VoiceItem } from '../component/VoiceItem';
import { BottomButtons } from '../component/BottomButtons';
import { AllCategory } from '../component/AllCategory';
import { PostContext } from '../component/PostContext';

import { SvgXml } from 'react-native-svg';
import notificationSvg from '../../assets/discover/notification.svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import searchSvg from '../../assets/login/search.svg';

import { windowWidth, Categories, windowHeight } from '../../config/config';
import { styles } from '../style/Common';
import VoiceService from '../../services/VoiceService';
import { CommenText } from '../component/CommenText';
import { SafeAreaView } from 'react-native-safe-area-context';

const DiscoverScreen = (props) => {

  const [category, setCategory] = useState(0);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [nowVoice, setNowVoice] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [showContext,setShowContext] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const [loadmore, setloadmore] = useState(10);
  const [showEnd,setShowEnd] = useState(false);


  let { refreshState } = useSelector((state) => {
    return (
        state.user
    )
  });

  const {t, i18n} = useTranslation();

  const onSetCategory = (categoryId)=>{
    setCategory(categoryId);
    getVoices(true,categoryId);
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const OnShowEnd = ()=>{
    if(showEnd) return ;
    setShowEnd(true);
    setTimeout(() => {
     setShowEnd(false);
    }, 2000);
  }

  const getVoices = async(isNew,categoryId=category) => {
    if(isNew)
      onStopPlay();
    else if(isloading){
      return ;
    }
    else if(loadmore < 10){
      OnShowEnd();
      return ;
    }
    let len = isNew?0:filteredVoices.length;
    setIsloading(true);
    VoiceService.getDiscoverVoices('',len, Categories[categoryId].label ).then(async res => {
      if (res.respInfo.status === 200) {
        const jsonRes = await res.json();
        setFilteredVoices((filteredVoices.length==0||isNew)?jsonRes:[...filteredVoices,...jsonRes]);
        setloadmore(jsonRes.length);
        setIsloading(false);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const onStopPlay = () => {
    setNowVoice(null);
  };

  const pressPlayVoice = (index)=>{
    if(nowVoice!=null){
      onStopPlay();
    }
    if(nowVoice!=index){
      setTimeout(() => {
        setNowVoice(index);
      }, nowVoice?400:0);
    }
  }

  const tapHoldToAnswer = (index) => {
    setSelectedIndex(index)
    setShowContext(true);
  }

  const setLiked = ()=>{
    let tp = filteredVoices;
    tp[selectedIndex].islike = !tp[selectedIndex].islike;
    setFilteredVoices(tp);
  }

  useEffect(() => {
    getVoices(true);
  }, [refreshState])

  return (
      <SafeAreaView
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <View
          style={[
            { marginTop: 20, paddingHorizontal: 20, marginBottom:20, height:30 }, 
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
              position:'absolute',
              right:20
            }}
            onPress = {()=>props.navigation.navigate('Notification')}
          >
            <SvgXml 
              width="24" 
              height="24" 
              xml={notificationSvg} 
            />
          </TouchableOpacity>

        </View>

        <View style={[styles.paddingH16]}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
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
                  fontSize:17,
                  color:'grey'
                }}
              >{t("Search")+'...'}</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          style = {{marginBottom:80, marginTop:25}}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              getVoices(false);
            }
          }}
          scrollEventThrottle={400}
        >
          <View
          style={[styles.paddingH16, styles.rowSpaceBetween]}
          >
            <TitleText 
              text={t("Top Category")}
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
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            style={[{marginLeft:12},styles.mt16]}
            data = {Categories}
            renderItem={({item,index})=>
              <CategoryIcon 
                key = {'category'+index}
                label={item.label}
                source={item.uri}
                onPress={()=>onSetCategory(index)}
                active={category == index ? true : false}
              />
            }
            keyExtractor={(item, index) => index.toString()} 
          /> 
        </View>
        <TitleText
            text={t("World voices")}
            fontSize={20}
            marginTop = {10}
            marginLeft = {16}
        />
        {!isloading?
          (filteredVoices.length>0?
          filteredVoices.map((item,index)=><VoiceItem 
              key={index+'discover'}
              info={item}
              props={props}
              isPlaying = {index==nowVoice}
              onPressPostContext={()=>tapHoldToAnswer(index)}
              onPressPlay={() => pressPlayVoice(index)}
              onStopPlay={()=>onStopPlay()}
            />
          )
          :
          <View style = {{marginTop:80,alignItems:'center',width:windowWidth}}>
            <SvgXml
                xml={box_blankSvg}
            />
            <DescriptionText
              text = {t("No result found")}
              fontSize = {17}
              lineHeight = {28}
              marginTop = {22}
            />
          </View>):
          <Progress.Circle
            indeterminate
            size={30}
            color="rgba(0, 0, 255, .7)"
            style={{ alignSelf: "center", marginTop:windowHeight/6 }}
          />
        }
        {showEnd&&<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center', padding:12}}>
          <Image
            style={{
              width:20,
              height:20
            }}
            source={require('../../assets/common/happy.png')} 
          />
          <DescriptionText
            marginLeft={15}
            text = {t("You are up to date!")}
          />
        </View>}
        </ScrollView>
        <SwipeDownModal
          modalVisible={showModal}
          ContentModal={
            <AllCategory
              closeModal={()=>setShowModal(false)}
              selectedCategory = {category}
              setCategory={(id)=>{onSetCategory(id);setShowModal(false)}}
            />
          }
          ContentModalStyle={styles.swipeModal}
          onRequestClose={() => {setShowModal(false)}}
          onClose={() => {
              setShowModal(false);
          }}
        />
        {showContext&&
          <PostContext
            postInfo = {filteredVoices[selectedIndex]}
            onCloseModal = {()=>setShowContext(false)}
            onChangeIsLike={()=>setLiked()}
            props = {props}
          />
        }
        <BottomButtons 
          active='global'
          props = {props}
        />
      </SafeAreaView>
  );
};

export default DiscoverScreen;