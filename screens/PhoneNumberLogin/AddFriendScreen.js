import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';

import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import { MyTextField } from '../component/MyTextField';
import { ConfirmVerify } from '../component/ConfirmVerify';
import { SvgXml } from 'react-native-svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/SemiBoldText';
import EditService from '../../services/EditService';
import * as bcrypt from 'bcryptjs';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/actions';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { windowHeight, windowWidth } from '../../config/config';
import { ScrollView } from 'react-native-gesture-handler';
import VoiceService from '../../services/VoiceService';

const AddFriendScreen = (props) => {

    const { t, i18n } = useTranslation();

    const [activeUsers, setActiveUsers] = useState([]);

    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const getActiveUsers =()=>{
        VoiceService.getActiveUsers().then(async res=>{
            const jsonRes = await res.json();
            console.log(jsonRes[0], res.respInfo.status);
        })
        .catch(err => {
            console.log(err);
            props.navigation.navigate('Welcome');
        });
    }

    useEffect(() => {
        getActiveUsers();
    }, [])
    return (
        <SafeAreaView
            style={{
                backgroundColor: '#FFF',
                flex: 1
            }}
        >
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                alignItems: 'center',
                marginTop: 26
            }}>
                <View></View>
                <TitleText
                    text={t("Add friends")}
                    fontSize={20}
                    lineHeight={24}
                />
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <DescriptionText
                        text={t("Skip")}
                        color="#8327D8"
                        fontSize={17}
                        lineHeight={28}
                    />
                </TouchableOpacity>
            </View>
            <SemiBoldText
                text={t("Add users as friends")}
                fontSize={17}
                lineHeight={28}
                marginTop={22}
                marginLeft={16}
            />
            <ScrollView
                style={{
                    maxHeight:windowHeight/2
                }}
            >

            </ScrollView>
            <View style={{
                position: 'absolute',
                bottom: 30,
                width: windowWidth,
                paddingHorizontal: 16
            }}>
                <MyButton
                    label={t("Continue")}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddFriendScreen;