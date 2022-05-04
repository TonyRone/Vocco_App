import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { TitleText } from '../component/TitleText';
import { MyButton } from '../component/MyButton';
import { MyProgressBar } from '../component/MyProgressBar';
import { SearchCountry } from '../component/SearchCountry';

import { SvgXml } from 'react-native-svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESSTOKEN_KEY} from '../../config/config';
import { setUser } from '../../store/actions/index';
import { useSelector , useDispatch } from 'react-redux';
import { styles } from '../style/Login';
import EditService from '../../services/EditService';
import { SafeAreaView } from 'react-native-safe-area-context';

const CountryScreen = (props) => {

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('');

  const {t, i18n} = useTranslation();

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const checkLogin = async () => {
  }

  const getMessage = () => {
    const status = isError ? `${t("Error")}: ` : `${t("Success")}: `;
    return status + message;
  }

  const handleSubmit = async () => {
    let userData = {...user};
    userData.country = country.country;
    dispatch(setUser(userData));

    const token = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
    const payload = {
      name: userData.name,
      dob: userData.dob,
      country:userData.country,
      gender:userData.gender,
    };
    EditService.changeProfile(payload).then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.respInfo.status !== 200) {
                setIsError(true);
                setMessage(jsonRes.message);
            } else {
              props.navigation.navigate('Photo');
                setIsError(false);
                setMessage(jsonRes.message);
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });

    props.navigation.navigate('Photo');
  }

  const selectedCountry = (cty)=>{
    setCountry(cty);
  }

  useEffect(() => {
    checkLogin();
  }, [])

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1
      }}
    >
      <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
      <View
        style={[
          { marginTop: 20, paddingHorizontal: 20, marginBottom: 20, height: 30 },
          styles.rowSpaceBetween
        ]}
      >
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
        >
          <SvgXml
            width="24"
            height="24"
            xml={arrowBendUpLeft}
          />
        </TouchableOpacity>
        <MyProgressBar
          progress={4}
        />
        <TouchableOpacity
          onPress={handleSubmit}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#8327D8',
              fontSize: 15,
            }}>{t("Next")}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ marginTop: 20, paddingHorizontal: 20 }}
      >
        <TitleText
          text={t("Select your country")}
          fontSize={22}
          textAlign="center"
        />
      </View>
      <SearchCountry
        marginHorizontal ={16}
        marginTop = {35}
        onSelectCountry={(cty)=>selectedCountry(cty)}
      />
      <LinearGradient
        colors={['#FFFFFF', 'rgba(255,255,255, 0)']}
        locations={[0.7,1]}
        start={{x: 0, y: 1}} end={{x: 0, y: 0}}
        style={{
          paddingHorizontal: 16,
          position: 'absolute',
          width: '100%',
          bottom: 30
        }}
      >
        <MyButton
          label={t("Next")}
          onPress={handleSubmit}
          active={country ? true : false}
        />
    </LinearGradient>
    </SafeAreaView>
  );
};

export default CountryScreen;