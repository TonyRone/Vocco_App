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
import addSvg from '../../assets/setting/add.svg';

import { windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/CommenText';
import VoiceService from '../../services/VoiceService';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState } from '../../store/actions';
import { RecordIcon } from '../component/RecordIcon';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { Feed } from '../component/Feed';
import { Discover } from '../component/Discover';
import { TitleText } from '../component/TitleText';

const FriendsScreen = (props) => {

    const { t, i18n } = useTranslation();

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView
            style={{
                backgroundColor: '#FFF',
                flex: 1,
            }}
        >
            <View
                style={[
                    { marginTop: 20, paddingHorizontal: 20, marginBottom: 25},
                    styles.rowSpaceBetween
                ]}
            >
                <TitleText
                    text={t("Friends")}
                    fontSize={28}
                    color="#281E30"
                />
                <View style={styles.rowAlignItems}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}>
                        <SvgXml
                            width="24"
                            height="24"
                            xml={searchSvg}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}>
                        <SvgXml
                            width="24"
                            height="24"
                            style={{ marginLeft: 12 }}
                            xml={addSvg}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <BottomButtons
                active='friends'
                props={props}
            />
            <RecordIcon
                props={props}
                bottom={15.5}
                left={windowWidth / 2 - 27}
            />
        </SafeAreaView>
    )
}

export default FriendsScreen;
