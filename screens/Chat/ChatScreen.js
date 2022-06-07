import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    SafeAreaView,
    Vibration,
    KeyboardAvoidingView
} from 'react-native';

import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import closeSvg from '../../assets/common/close.svg';
import { BottomButtons } from '../component/BottomButtons';
import black_settingsSvg from '../../assets/notification/black_settings.svg';
import notificationSvg from '../../assets/discover/notification.svg';
import searchSvg from '../../assets/login/search.svg';

import { windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import VoiceService from '../../services/VoiceService';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState } from '../../store/actions';
import { RecordIcon } from '../component/RecordIcon';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { Feed } from '../component/Feed';
import { Discover } from '../component/Discover';
import { TitleText } from '../component/TitleText';

const ChatScreen = (props) => {

    const { t, i18n } = useTranslation();

    useEffect(() => {

    }, [])

    return (
        <KeyboardAvoidingView
            style={{
                backgroundColor: '#FFF',
                flex: 1,
            }}
        >
            <View
                style={[
                    { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 20, marginBottom: 25, height: 30 },
                    styles.rowSpaceBetween
                ]}
            >
                <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}>
                    <SvgXml
                        width={24}
                        height={24}
                        xml={black_settingsSvg}
                    />
                </TouchableOpacity>
                <TitleText
                    text={t("Chat")}
                    fontSize={20}
                    color="#281E30"
                />
                <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}>
                    <SvgXml
                        width="24"
                        height="24"
                        xml={searchSvg}
                    />
                </TouchableOpacity>
            </View>
            <BottomButtons
                active='chat'
                props={props}
            />
            <RecordIcon
                props={props}
                bottom={15.5}
                left={windowWidth / 2 - 27}
            />
        </KeyboardAvoidingView>
    )
}

export default ChatScreen;
