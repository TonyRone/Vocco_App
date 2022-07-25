import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Image, PermissionsAndroid, Platform, NativeModules } from 'react-native';
import io from "socket.io-client";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import { ACCESSTOKEN_KEY, SOCKET_URL, TUTORIAL_CHECK, MAIN_LANGUAGE, APP_NAV, OPEN_COUNT } from '../../config/config';
import { NavigationActions, StackActions } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, setSocketInstance } from '../../store/actions/index';

import AuthService from '../../services/AuthService';

const LogoScreen = (props) => {

    const { t, i18n } = useTranslation();

    let { user, socketInstance } = useSelector((state) => {
        return (
            state.user
        )
    });

    const dispatch = useDispatch();

    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
            : NativeModules.I18nManager.localeIdentifier;

    const onGoScreen = async (jsonRes, prevOpenCount) => {
        let openCount = await AsyncStorage.getItem(OPEN_COUNT);
        if (openCount != prevOpenCount) {
            return;
        }
        if (prevOpenCount == null)
            openCount = "1";
        else
            openCount = (Number(prevOpenCount) + 1).toString();
        await AsyncStorage.setItem(
            OPEN_COUNT,
            openCount
        );
        dispatch(setUser(jsonRes));
        let navigateScreen = 'Home';
        if (!jsonRes.id) {
            return;
        }
        if (!jsonRes.name) {
            navigateScreen = 'PickName';
        } else if (!jsonRes.dob) {
            navigateScreen = 'InputBirthday';
        } else if (!jsonRes.gender) {
            navigateScreen = 'SelectIdentify';
            // } else if (!jsonRes.avatar&&!jsonRes.avatarNumber) {
            //     navigateScreen = 'ProfilePicture';
        } else {
            const tutorial_check = await AsyncStorage.getItem(TUTORIAL_CHECK);
            if (tutorial_check)
                navigateScreen = 'Home';
            else
                navigateScreen = 'Tutorial';
        }
        const resetActionTrue = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: navigateScreen })],
        });
        props.navigation.dispatch(resetActionTrue);
    }

    const onCreateSocket = async (jsonRes) => {
        let open_count = await AsyncStorage.getItem(OPEN_COUNT);
        if (socketInstance == null) {
            let socket = io(SOCKET_URL);
            dispatch(setSocketInstance(socket));
            socket.on("connect", () => {
                socket.emit("login", { uid: jsonRes.id, email: jsonRes.email, isNew: false }, (res) => {
                    if (res == "Success") {
                        onGoScreen(jsonRes, open_count);
                    }
                    else {
                        props.navigation.navigate('Welcome');
                    }
                });
            })
        }
        else
            onGoScreen(jsonRes, open_count);
    }
    const checkLogin = async () => {
        let mainLanguage = await AsyncStorage.getItem(MAIN_LANGUAGE);
        if (mainLanguage == null) {
            if (deviceLanguage[0] == 'e') {
                await AsyncStorage.setItem(
                    MAIN_LANGUAGE,
                    'English'
                );
                mainLanguage = 'English';
            }
            else {
                await AsyncStorage.setItem(
                    MAIN_LANGUAGE,
                    'French'
                );
                mainLanguage = 'French';
            }
        }
        i18n.changeLanguage(mainLanguage).then(async () => {
            const aToken = await AsyncStorage.getItem(ACCESSTOKEN_KEY);
            if (aToken != null) {
                AuthService.getUserInfo().then(async res => {
                    const jsonRes = await res.json();
                    if (res.respInfo.status == 200 && jsonRes != null) {
                        onCreateSocket(jsonRes);
                    }
                    else {
                        props.navigation.navigate('Welcome');
                    }
                })
                    .catch(err => {
                        console.log(err);
                        props.navigation.navigate('Welcome');
                    });
            }
            else {
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
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
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

    const OnIosPermission= async ()=>{
        await recorderPlayer.startPlayer("").then(res => {
        })
          .catch(err => {
            console.log(err);
          });
      }

    useEffect(() => {
        OnIosPermission();
        checkPermission();
        checkLogin();
    }, [])

    return (
        <KeyboardAvoidingView style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={require('../../assets/welcome/logo.png')}
                style={{ width: 187, height: 85 }}
            />
        </KeyboardAvoidingView>
    );
};

export default LogoScreen;