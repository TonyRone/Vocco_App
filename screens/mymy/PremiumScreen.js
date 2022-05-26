import React, { useState, useEffect } from 'react';
import { 
  View, 
  ImageBackground, 
  KeyboardAvoidingView,
  TouchableOpacity, 
} from 'react-native';

import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import { SvgXml } from 'react-native-svg';
import readedSvg from '../../assets/setting/readed.svg';
import circleCheckSvg from '../../assets/setting/circle_check.svg';
import circleUnCheckSvg from '../../assets/setting/circle_uncheck.svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';

import { useSelector , useDispatch } from 'react-redux';
import { setUser, setRefreshState } from '../../store/actions';

import { windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import EditService from '../../services/EditService';
import { CommenText } from '../component/CommenText';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';

const  PremiumScreen = (props) => {

  const {t, i18n} = useTranslation();

  const [premiumState, setPremiumState] = useState('monthly'); 
  const [loading,setLoading] = useState(false);

  const [identify, setIdentify] = useState('');

  const {user, refreshState} = useSelector((state)=>state.user);
  const dispatch = useDispatch();

  const changePremiumState =()=>{
    setLoading(true);
    EditService.changePremium(premiumState).then(async res => {
      if(res.respInfo.status==201){
          let userData = {...user}
          userData.premium = premiumState
          dispatch(setUser(userData));
          dispatch(setRefreshState(!refreshState));
          props.navigation.goBack();
      }
      setLoading(false);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  useEffect(() => {

  }, [])

  return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
       <ImageBackground
          source={require('../../assets/common/preminum_background.jpg')}
          resizeMode="stretch"
          style={styles.background}
        >
          <View style={{marginTop:Platform.OS=='ios'?60:35,paddingHorizontal:16, flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
            <TouchableOpacity onPress={()=>props.navigation.goBack()}>
              <SvgXml width="24" height="24" xml={closeBlackSvg} />  
            </TouchableOpacity>
            <CommenText
              text = {t("Go to Premium")}
            />
            <View style={{height:24, width:24}}>
            </View>
          </View>
          <View style={{position:'absolute', width:'100%',bottom:108,paddingHorizontal:16}}>
            <View style={{ flexDirection:'row',alignItems:'center',marginLeft:15}}>
              <SvgXml
                width={24}
                height={24}
                xml={readedSvg}
              />
              <DescriptionText
                text={t("Create vocal up to 3 minutes")}
                fontSize={17}
                lineHeight={28}
                color='#281E30'
                marginLeft={14}
              />
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginLeft:15, marginTop:8}}>
              <SvgXml
                width={24}
                height={24}
                xml={readedSvg}
              />
              <DescriptionText
                text={t("Special status in app")}
                fontSize={17}
                lineHeight={28}
                color='#281E30'
                marginLeft={14}
              />
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginLeft:15, marginTop:8}}>
              <SvgXml
                width={24}
                height={24}
                xml={readedSvg}
              />
              <DescriptionText
                text={t("No ads")}
                fontSize={17}
                lineHeight={28}
                color='#281E30'
                marginLeft={14}
              />
            </View>
            <TouchableOpacity style={{
              width:windowWidth-32,
              height:101,
              borderRadius:12,
              borderWidth:1,
              borderColor:premiumState=='monthly'?'#8229F4':'#D4C9DE',
              backgroundColor:'rgba(255,255,255,0.7)',
              paddingHorizontal:16,
              paddingVertical:11,
              marginTop:32
            }}
              onPress={()=>setPremiumState('monthly')}
            >
              <View style={styles.rowSpaceBetween}>
                <DescriptionText
                  text={t("MONTHLY")}
                  fontSize={11}
                  lineHeight={12}
                  color='rgba(59, 31, 82, 0.6)'
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={premiumState=='monthly'?circleCheckSvg:circleUnCheckSvg}
                />
              </View>
              <DescriptionText
                text={'$4.99/'+t("month")}
                fontSize={20}
                lineHeight={24}
                color='#281E30'
                marginTop={9}
              />
              <DescriptionText
                text={t("then 20.99 per month. Cancel anytime")}
                fontSize={13}
                lineHeight={21}
                marginTop={5}
                color='rgba(59, 31, 82, 0.6)'
              />
            </TouchableOpacity>
            <TouchableOpacity style={{
              width:windowWidth-32,
              height:101,
              borderRadius:12,
              borderWidth:1,
              borderColor:premiumState!='monthly'?'#8229F4':'#D4C9DE',
              backgroundColor:'rgba(255,255,255,0.7)',
              paddingHorizontal:16,
              paddingVertical:11,
              marginTop:16,
            }}
              onPress={()=>setPremiumState('yearly')}
            >
              <View style={styles.rowSpaceBetween}>
                <View style={styles.rowAlignItems}>
                  <DescriptionText
                    text={t("YEARLY")}
                    fontSize={11}
                    lineHeight={12}
                    color='rgba(59, 31, 82, 0.6)'
                  />
                  <View style={{borderRadius:4,backgroundColor:'#F8F0FF',paddingHorizontal:8,paddingVertical:4,marginLeft:20}}>
                    <CommenText
                      text = {t("Get 40% off")}
                      fontSize={12}
                      lineHeight={16}
                      color='#8327D8'
                    />
                  </View>
                </View>
                <SvgXml
                  width={20}
                  height={20}
                  xml={premiumState!='monthly'?circleCheckSvg:circleUnCheckSvg}
                />
              </View>
              <DescriptionText
                text={'$35.99/'+t("year")}
                fontSize={20}
                lineHeight={24}
                color='#281E30'
                marginTop={9}
              />
              <DescriptionText
                text={t("then 39.99 per year. Cancel anytime")}
                fontSize={13}
                lineHeight={21}
                marginTop={5}
                color='rgba(59, 31, 82, 0.6)'
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View 
          style={{
            paddingHorizontal:16,
            position:'absolute',
            width:'100%',
            bottom:30
          }}
        >
          <MyButton
            label={t("Continue to checkout")}
            onPress={changePremiumState}
            loading = {loading}
          />
        </View>
      </KeyboardAvoidingView>
  );
};

export default PremiumScreen;