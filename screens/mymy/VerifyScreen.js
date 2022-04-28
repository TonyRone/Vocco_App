import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { TitleText } from '../component/TitleText';
import { ConfirmVerify } from '../component/ConfirmVerify';

import { SvgXml } from 'react-native-svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY, windowHeight, API_URL } from '../../config/config';
import { styles } from '../style/Login';
import AuthService from '../../services/AuthService';

const VerifyScreen = (props) => {

  //const [pseudo, setPseudo] = useState("");
  //const [message, setMessage] = useState('');
  const {t, i18n} = useTranslation();

  const checkLogin = async () => {
  }

  const handleSubmit = async () => {
    
  }

  useEffect(() => {
    checkLogin();
  }, [])

  return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <View
          style={[
            { marginTop: 50, paddingHorizontal: 20, marginBottom:20, height:30 }, 
            styles.rowJustifyCenter
          ]}
        >
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{
              position:'absolute',
              left:20
            }}
          >
            <SvgXml 
              width="24" 
              height="24" 
              xml={arrowBendUpLeft} 
            />
          </TouchableOpacity>
          <TitleText 
            text={t("Verify it's you")} 
            fontSize={20}
            color="#281E30"
          />
        </View>
        <ConfirmVerify
          marginTop={20}
          onSuccess = {()=>props.navigation.navigate('Username')}
        />
      </KeyboardAvoidingView>
  );
};

export default VerifyScreen;