import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import * as Progress from "react-native-progress";
import {useTranslation} from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../language/i18n';
import LinearGradient from 'react-native-linear-gradient';
import SwipeDownModal from 'react-native-swipe-down';
import { TitleText } from '../component/TitleText';
import { FlatList } from 'react-native-gesture-handler';
import { BlockList } from '../component/BlockList';
import { CategoryIcon } from '../component/CategoryIcon';
import { DescriptionText } from '../component/DescriptionText';
import { VoiceItem } from '../component/VoiceItem';
import { BottomButtons } from '../component/BottomButtons';
import { AllCategory } from '../component/AllCategory';
import { PostContext } from '../component/PostContext';

import VoiceService from '../../services/VoiceService';

import { SvgXml } from 'react-native-svg';
import box_blankSvg from '../../assets/discover/box_blank.svg';
import image_shadowSvg from '../../assets/discover/image_shadow.svg';
import searchSvg from '../../assets/login/search.svg';
import erngSvg from '../../assets/common/erng.svg';
import erng2Svg from '../../assets/common/erng2.svg';
import closeSvg from '../../assets/discover/close.svg'

//icons
import heartSvg from '../../assets/common/icons/heart.svg';
import smileSvg from '../../assets/common/icons/smile.svg';
import shineSvg from '../../assets/common/icons/shine.svg';

import closeCircleSvg from '../../assets/common/close-circle.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Categories, STORAGE_KEY, windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import { Stories } from '../component/Stories';
import { RecordIcon } from '../component/RecordIcon';

const SearchScreen = (props) => {

  const [error, setError] = useState({});
  const [category, setCategory] = useState(0);
  const [label,setLabel] = useState('');
  const [filterTitles, setFilterTitles] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [showVoices,setShowVoices] = useState(false);
  const [searchStory, setSearchStory] = useState('');
  const [isEmpty,setIsEmpty] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [showContext,setShowContext] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const [nowVoice, setNowVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const {t, i18n} = useTranslation();

  const inputRef = useRef(null);
  const scrollRef = useRef();

  let {user, refreshState} = useSelector((state) => {
    return (
        state.user
    )
  });

  const onChangeCategory =(id)=>{
    setCategory(id);
    getLabel('');
    setSelectedCategory(id);
    scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setShowModal(false);
  }

  const getLabel = (v) =>{
    setLabel(v);
    if(showVoices) setShowVoices(false);
    if(v!=''){
      setIsLoading(true);
      VoiceService.getDiscoverTitle(v,0,Categories[category].label).then(async res => {
        if (res.respInfo.status === 200) {
          const jsonRes = await res.json();
          setFilterTitles(jsonRes);
          setIsEmpty(jsonRes.length==0);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
      setIsEmpty(false);
      setFilterTitles([]);
    }
  }

  // const onLoadMoreTitle=()=>{
  //   VoiceService.getDiscoverTitle(label,filterTitles.length,Categories[category].label).then(async res => {
  //     if (res.respInfo.status === 200) {
  //       const jsonRes = await res.json();
  //       if(jsonRes.length > 0)
  //         setFilterTitles(filterTitles.length==0?jsonRes:[...filterTitles,...jsonRes]);
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // }

  const onLoadVoices = (title,recordId)=>{
    setLabel(title);
    setSearchStory(recordId);
    setShowVoices(true);
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
    let item = tp[selectedIndex].isLike;
    if(item)
      tp[selectedIndex].likesCount --;
    else
      tp[selectedIndex].likesCount ++;
    tp[selectedIndex].isLike = !tp[selectedIndex].isLike;
    setFilteredVoices(tp);
  }

  const onChangeLike = (id, val)=>{
    let tp = filteredVoices;
    let item = tp[id].isLike;
    if(item === true){
      tp[id].likesCount --;
    }
    else{
      tp[id].likesCount ++;
    }
    tp[id].isLike = val;
    setFilteredVoices(tp);
  }

  useEffect(() => {

  }, [refreshState])

  return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <View style={[styles.paddingH16,{marginTop:Platform.OS=='ios'?50:20,flexDirection:'row', alignItems:'center',justifyContent:'space-between'}]}>
          <View style={{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor: '#F2F0F5',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#CC9BF9',
            height:44,
            width: windowWidth-95,
            paddingHorizontal:12
          }}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <SvgXml
                width="20"
                height="20"
                xml={searchSvg}
              />
              {category>0&&
              <View style={{flexDirection:'row',marginLeft:12,alignItems:'center',width:78,height:32,borderRadius:16,backgroundColor:'#D4C9DE'}}>
                <View style={{width:33,marginLeft:16}}>
                  <DescriptionText
                    text={Categories[category].label}
                    fontSize={17}
                    lineHeight={28}
                    color='#281E30'
                  />
                </View>
                <TouchableOpacity onPress={()=>setCategory(0)}>
                  <SvgXml
                    width={24}
                    height={24}
                    xml={closeCircleSvg}
                  />
                </TouchableOpacity>
              </View>}
              <TextInput
                style={[styles.searchInput,{paddingLeft:12,width:windowWidth-(category==0?175:265)}]}
                ref = {inputRef}
                value={label}
                color = '#281E30'
                autoFocus={true}
                placeholder={t("Search")}
                onChangeText={getLabel}
                placeholderTextColor="rgba(59, 31, 82, 0.6)"
              />
            </View>
            {label!=''&&
            <TouchableOpacity
              onPress={() => {setLabel('');setShowVoices(false);}}
            >
              <SvgXml
                width="30"
                height="30"
                xml={closeCircleSvg}
              />
            </TouchableOpacity>}
          </View>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <TitleText
              text = {t('Cancel')}
              fontSize={17}
              fontFamily='SFProDisplay-Regular'
              color='#8327D8'
            />
          </TouchableOpacity>
        </View>
        {label!=''&&!isLoading&&isEmpty&&
        <View style={{marginTop:227,alignItems:'center'}}>
          <SvgXml 
            width={118}
            height={118} 
            xml={box_blankSvg} 
          />
          <SvgXml 
            width={150} 
            height={50} 
            xml={image_shadowSvg} 
          />
          <TitleText
            text = 'No result found'
            fontSize={17}
            fontFamily='SFProDisplay-Regular'
            color='rgba(54, 36, 68, 0.8)'
            marginTop={32}
          />
        </View>
        }
        {!showVoices&&!isEmpty&&label !=''&&filterTitles&&
          <>
            <View style={[styles.rowSpaceBetween,styles.paddingH16,{marginTop:28}]}>
              <TitleText
                text={t('Users')}
                color='#281E30'
                fontSize={15}
              />
              <TouchableOpacity onPress={()=>setShowMore(!showMore)}>
                <DescriptionText
                  text={showMore?t('SHOW LESS'):t("SHOW MORE")}
                  fontSize={13}
                  fontFamily="SFProDisplay-Regular"
                  color='#281E30'
                />
              </TouchableOpacity>
            </View>
            <View style={{width:'100%',height:1,backgroundColor:'#F0F4FC',marginLeft:16, marginTop:9,marginBottom:18}}></View>
            <View><FlatList
              style={[styles.paddingH16]}
              data={filterTitles.user}
              renderItem={({item,index})=>
                (!showMore&&index>3)?null:
                <TouchableOpacity
                  onPress = {()=>{
                    if(item.id==user.id)
                      props.navigation.navigate('Profile');
                    else
                      props.navigation.navigate('UserProfile',{userId:item.id});
                  }}
                  style={{marginBottom:20,flexDirection:'row',alignItems:'center'}} key = {index+'loadusers'}
                >
                  <Image
                    source={{uri:item.avatar.url}}
                    style={{width:24,height:24,borderRadius:7.2}}
                    resizeMode='cover'
                  />
                  <DescriptionText
                    text = {item.name}
                    fontSize={15}
                    color='#281E30'
                    marginLeft={10}
                  />
                </TouchableOpacity>
              }
              keyExtractor={(item, index) => index.toString()}
            //  onEndReached = {()=>onLoadMoreTitle()}
              onEndThreshold={0}
            /></View>
            <TitleText
              text={t("Voices")}
              color='#281E30'
              fontSize={15}
              marginLeft={16}
              marginTop={7}
            />
            <View style={{width:'100%',height:1,backgroundColor:'#F0F4FC',marginLeft:16, marginTop:9,marginBottom:18}}></View>
            <FlatList
              style={[styles.paddingH16]}
              data={filterTitles.record}
              renderItem={({item,index})=>{
                return <TouchableOpacity key = {index+'loadvoices'} onPress={()=>onLoadVoices(item.title,item.id)}>
                  <TitleText
                    text = {item.title}
                    fontSize={15}
                    fontFamily='SFProDisplay-Regular'
                    color='#281E30'
                    marginBottom={20}
                  />
                </TouchableOpacity>}
              }
              keyExtractor={(item, index) => index.toString()}
            //  onEndReached = {()=>onLoadMoreTitle()}
              onEndThreshold={0}
            />
          </>
        }
        {showVoices&&<>
          <View
            style={[styles.paddingH16, styles.rowSpaceBetween, styles.mt25]}
          >
            <TitleText 
              text= {t("Top Category")}
              fontSize={20}
            />
            <TouchableOpacity
              onPress={() => setShowModal(true)}
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
              renderItem={({item,index})=>{
                let idx = 0;
                if(selectedCategory > 0){
                  if(index == 0) idx = selectedCategory;
                  else if(index <= selectedCategory) idx = index-1;
                  else idx = index;
                }
                else idx = index;
                return <CategoryIcon 
                  key = {'category'+idx}
                  label={Categories[idx].label}
                  source={Categories[idx].uri}
                //  onPress={()=>{setCategory(index);getLabel('');}}
                  active={category == idx ? true : false}
                />
              }}
              keyExtractor={(item, idx) => idx.toString()} 
            />
          </View>
          <TitleText
              text={t("Search result")}
              fontSize={20}
              marginLeft={16}
              marginTop = {25}
          />
          {searchStory!=''&&
          <Stories
            props={props}
            screenName = "Search"
            searchTitle = {label}
            recordId= {searchStory}
          />}
        </>}
        {label==''&&<View>
          <View
            style={[styles.paddingH16, styles.rowSpaceBetween, styles.mt25]}
          >
            <TitleText 
              text={t("Category")}
              fontSize={15}
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
          <View style={{height:1,backgroundColor:'#F0F4FC',marginTop:9,marginLeft:16}}></View>
          <View>
            {/* <FlatList
              horizontal = {true}
              showsHorizontalScrollIndicator = {false}
              style={[{marginLeft:12},styles.mt16]}
              data = {Categories}
              renderItem={({item,index})=>
                <CategoryIcon 
                  key = {'category'+index}
                  label={item.label}
                  source={item.uri}
                  onPress={()=>setCategory(index)}
                  active={category == index ? true : false}
                />
              }
              keyExtractor={(item, index) => index.toString()} 
            /> */}
            <FlatList
              horizontal = {true}
              ref = {scrollRef}
              showsHorizontalScrollIndicator = {false}
              style={[{marginLeft:12},styles.mt16]}
              data = {Categories}
              renderItem={({item,index})=>{
                let idx = 0;
                if(selectedCategory > 0){
                  if(index == 0) idx = selectedCategory;
                  else if(index <= selectedCategory) idx = index-1;
                  else idx = index;
                }
                else idx = index;
                return <CategoryIcon 
                  key = {'category'+idx}
                  label={Categories[idx].label}
                  source={Categories[idx].uri}
                  onPress={()=>setCategory(idx)}
                  active={category == idx ? true : false}
                />
              }}
              keyExtractor={(item, idx) => idx.toString()} 
            />
          </View>
          <ScrollView style={{paddingLeft:16,marginTop:31}}>
            <BlockList marginTop ={0} blockName={t("Recent")} items={[]}/>
            <BlockList marginTop ={26} blockName={t("Popular")} items={[]}/>
          </ScrollView>
        </View>}
        <SwipeDownModal
          modalVisible={showModal}
          ContentModal={
            <AllCategory
              closeModal={()=>setShowModal(false)}
              selectedCategory = {category}
              setCategory={(id)=>onChangeCategory(id)}
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
            props = {props}
            onChangeIsLike ={()=>setLiked()}
            onCloseModal = {()=>setShowContext(false)}
          />
        }
        <BottomButtons 
          active='global'
          props={props}
        />
        {isLoading&&<View style={{position:'absolute',width:'100%',top:windowHeight/2.8}}>
          <Progress.Circle
            indeterminate
            size={30}
            color="rgba(0, 0, 255, .7)"
            style={{ alignSelf: "center"}}
          />
        </View>}
        <RecordIcon
          props={props}
          bottom={15.5}
          left = {windowWidth/2-27}
        />
      </KeyboardAvoidingView>
  );
};

export default SearchScreen;