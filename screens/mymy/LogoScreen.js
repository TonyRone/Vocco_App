import React, { useEffect} from 'react';
import { KeyboardAvoidingView,  Image ,Text,PermissionsAndroid,Platform } from 'react-native';
import io from "socket.io-client";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESSTOKEN_KEY, SOCKET_URL, TUTORIAL_CHECK, MAIN_LANGUAGE,  DEVICE_TOKEN, DEVICE_OS, windowWidth, windowHeight } from '../../config/config';
import { NavigationActions, StackActions } from 'react-navigation';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, setSocketInstance } from '../../store/actions/index';

import { styles } from '../style/Welcome';
import AuthService from '../../services/AuthService';

const LogoScreen = (props) => {

    const {t, i18n} = useTranslation();

    let { user } = useSelector((state) => {
        return (
            state.user
        )
    });

    const dispatch = useDispatch();
    const checkLogin = async () => {
        let mainLanguage = await AsyncStorage.getItem(MAIN_LANGUAGE);
        if( mainLanguage == null ){
            await AsyncStorage.setItem(
                MAIN_LANGUAGE,
                'English'
            );
            mainLanguage = 'English';
        }
        i18n.changeLanguage(mainLanguage).then(async() => {
            const aToken = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
            if(aToken != null){
                AuthService.getUserInfo()
                .then(async res => {
                    try {
                        const jsonRes = await res.json();
                        if (res.respInfo.status ==200 && jsonRes != null){
                            dispatch(setUser(jsonRes));
                            let socket = io(SOCKET_URL);
                            dispatch(setSocketInstance(socket));
                            socket.emit("login", {uid:jsonRes.id, email:jsonRes.email});
                            let navigateScreen = 'Home';
                            if(!jsonRes.id){
                                return ;
                            }
                            if (!jsonRes.isEmailVerified) {
                            navigateScreen = 'Verify';
                            } else if (!jsonRes.name) {
                            navigateScreen = 'Username';
                            } else if (!jsonRes.dob) {
                            props.navigation.navigate('');
                            navigateScreen = 'Birthday';
                            } else if (!jsonRes.gender) {
                            navigateScreen = 'Identify';
                            } else if (!jsonRes.country) {
                            navigateScreen = 'Country';
                            } else if (!jsonRes.avatar) {
                            navigateScreen = 'Photo';
                            } else {
                            const tutorial_check = await AsyncStorage.getItem(TUTORIAL_CHECK);
                            if (tutorial_check)
                                navigateScreen = 'Home';
                            else
                                navigateScreen = 'Tutorial';
                            }
                            //props.navigation.navigate(navigateScreen,{info:jsonRes})
                            const resetActionTrue = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: navigateScreen })],
                            });
                            props.navigation.dispatch(resetActionTrue);
                        }
                        else{
                            props.navigation.navigate('Welcome');
                        }
                    } catch (err) {
                        console.log(err);
                        props.navigation.navigate('Welcome');
                    };
                })
                .catch(err => {
                    console.log(err);
                    props.navigation.navigate('Welcome');
                });
            }
            else{
                props.navigation.navigate('Welcome');
            }
        })
        .catch(err => console.log(err));
    }

    const checkPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const grants = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
    
            if (
              grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
              grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
              grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              console.log('Permissions granted');
            } else {
              console.log('All required permissions not granted');
              return;
            }
          } catch (err) {
            console.warn(err);
            return;
          }
        }
      }

    useEffect(() => {
        checkPermission();
        checkLogin();
    }, [])

    return (
        <KeyboardAvoidingView style={{width:'100%',height:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Image 
                source={require('../../assets/welcome/logo.png')} 
                style={{width: 187, height:85}}
            />
        </KeyboardAvoidingView>
    );
};

export default LogoScreen;