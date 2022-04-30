import React, { useEffect} from 'react';
import { KeyboardAvoidingView,  Image  } from 'react-native';
import PushNotification from 'react-native-push-notification';

import io from "socket.io-client";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESSTOKEN_KEY, SOCKET_URL, TUTORIAL_CHECK, MAIN_LANGUAGE,  DEVICE_TOKEN, DEVICE_OS } from '../../config/config';
import { NavigationActions, StackActions } from 'react-navigation';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';

import { useDispatch } from 'react-redux';
import { setUser, setSocketInstance } from '../../store/actions/index';

import { styles } from '../style/Welcome';
import AuthService from '../../services/AuthService';

const LogoScreen = (props) => {

    let socket = null;

    const {t, i18n} = useTranslation();

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
            socket = io(SOCKET_URL);
            dispatch(setSocketInstance(socket));
            if(aToken != null){
                AuthService.getUserInfo()
                .then(async res => {
                    try {
                        const jsonRes = await res.json();
                        console.log(jsonRes);
                        if (res.respInfo.status ==200 && jsonRes != null){
                            dispatch(setUser(jsonRes));
                            let navigateScreen = 'Discover';
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
                                navigateScreen = 'Discover';
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

    useEffect(() => {
        PushNotification.requestPermissions();
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