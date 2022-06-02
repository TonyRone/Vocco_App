import React, { useState , useCallback, useEffect} from 'react';
import { 
  View, 
  Pressable,
  TouchableOpacity,
  Image
} from 'react-native';

import * as Progress from "react-native-progress";
import { TitleText } from './TitleText';
import { VoiceItem } from './VoiceItem';
import SwipeDownModal from 'react-native-swipe-down';
import Share from 'react-native-share';
import { setRefreshState } from '../../store/actions';

import { SvgXml } from 'react-native-svg';
//Context Icons
import VoiceService from '../../services/VoiceService';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import { useSelector , useDispatch} from 'react-redux';
import { styles } from '../style/Common';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { ScrollView } from 'react-native-gesture-handler';

export const TagUserList = ({
  props,
  users,
  onCloseModal=()=>{},
}) => {

  const {t, i18n} = useTranslation();

  const [showModal,setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  let { user } = useSelector((state) => {
    return (
        state.user
    )
  });

  const closeModal = ()=>{
    setShowModal(false);
    onCloseModal();
  }

  useEffect(() => {

  }, [])
  
  return (
    <SwipeDownModal
      modalVisible={showModal}
      ContentModal={
        <View style={styles.swipeContainerContent}>
          <View style={[styles.rowSpaceBetween,{paddingLeft:16,paddingRight:14, paddingTop:14,paddingBottom:11,borderBottomWidth:1,borderBottomColor:'#F0F4FC'}]}>
            <TitleText
              text={t("Tag friends")+"("+users.length+")"}
              fontFamily="SFProDisplay-Semibold"
              fontSize={15}
              lineHeight={24}
            />
            <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
              <Pressable onPress={()=>closeModal()}>
                <SvgXml
                  width={18}
                  height={18}
                  xml={closeBlackSvg}
                />
              </Pressable>
            </View>
          </View>
          <ScrollView>
          {
            users.map((item,index)=><TouchableOpacity onPress = {()=>{
              if(item.id==user.id)
                props.navigation.navigate('Profile');
              else
                props.navigation.navigate('UserProfile',{userId:item.id});
              }} 
              key = {index+item.id+"likes"}
              style={{flexDirection:'row', alignItems:'center', marginLeft:16, marginTop:10, marginBottom:10}}
            >
              <Image
                source={{uri:item.avatar.url}}
                style={{width:50,height:50,borderRadius:25,borderColor:'#FFA002',borderWidth:item.premium=='none'?0:2}}
                resizeMode='cover'
              />
              <TitleText
                text={item.name}
                fontSize={17}
                marginLeft={16}
              />
            </TouchableOpacity>
            )
          }
          </ScrollView>
        </View>
      }
      ContentModalStyle={styles.swipeModal}
      onRequestClose={() => closeModal()}
      onClose={() => 
          closeModal()
      }
    />
  );
};
