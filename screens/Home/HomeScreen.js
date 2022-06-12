import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    SafeAreaView,
    Vibration
} from 'react-native';

import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import closeSvg from '../../assets/common/close.svg';
import { BottomButtons } from '../component/BottomButtons';
import black_settingsSvg from '../../assets/notification/black_settings.svg';
import notificationSvg from '../../assets/discover/notification.svg';

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

const HomeScreen = (props) => {

    let new_init = props.navigation.state.params ? -1 : 0;

    const { t, i18n } = useTranslation();

    const reducer = (noticeCount, action) => {
        if (action == 'news')
            return noticeCount + 1;
        if (action == 'reset')
            return 0;
    }

    const [isActiveState, setIsActiveState] = useState(true);
    const [notify, setNotify] = useState(false);
    const [expandKey, setExpandKey] = useState(0);

    const [noticeCount, noticeDispatch] = useReducer(reducer, new_init);

    let { user, refreshState, socketInstance } = useSelector((state) => {
        return (
            state.user
        )
    });

    const dispatch = useDispatch();

    const scrollIndicator = useRef(new Animated.Value(0)).current;

    const scrollIndicatorPosition = Animated.multiply(
        scrollIndicator,
        113 / windowWidth
    )

    const scrollRef = useRef();

    const getNewNotifyCount = () => {
        VoiceService.unreadActivityCount().then(async res => {
            if (res.respInfo.status == 201) {
                const jsonRes = await res.json();
                if (jsonRes.count > 0)
                    setNotify(true);
                else {
                    VoiceService.unreadRequestCount().then(async res => {
                        if (res.respInfo.status == 201) {
                            const jsonRes = await res.json();
                            if (jsonRes.count > 0)
                                setNotify(true);
                            else
                                setNotify(false);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getNewNotifyCount();
        socketInstance.on("notice_Voice", (data) => {
            noticeDispatch("news");
        });
        if (new_init < 0) {
            setTimeout(() => {
                noticeDispatch("reset");
            }, 1500);
        }
        return ()=>socketInstance.off("notice_Voice");
    }, [])

    return (
        <SafeAreaView
            style={{
                backgroundColor: '#FFF',
                flex: 1
            }}
        >
            <View style={[styles.rowSpaceBetween, { marginTop: 16, paddingHorizontal: 20 }]}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Setting')}>
                    <SvgXml
                        width={24}
                        height={24}
                        xml={black_settingsSvg}
                    />
                </TouchableOpacity>
                <View style={styles.rowSpaceBetween}>
                    <TouchableOpacity onPress={() => { scrollRef.current?.scrollTo({ x: 0, animated: true }); setIsActiveState(true); }} style={[styles.contentCenter, { width: 97, height: 44 }]}>
                        <SemiBoldText
                            text={t("Friends")}
                            fontFamily={isActiveState ? 'SFProDisplay-Semibold' : 'SFProDisplay-Regular'}
                            color={isActiveState ? '#281E30' : 'rgba(59, 31, 82, 0.6)'}
                            fontSize={17}
                            lineHeight={28}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { scrollRef.current?.scrollTo({ x: windowWidth, animated: true }); setIsActiveState(false); }} style={[styles.contentCenter, { width: 97, height: 44, marginLeft: 16 }]}>
                        <SemiBoldText
                            text={t("Discover")}
                            fontFamily={!isActiveState ? 'SFProDisplay-Semibold' : 'SFProDisplay-Regular'}
                            color={!isActiveState ? '#281E30' : 'rgba(59, 31, 82, 0.6)'}
                            fontSize={17}
                            lineHeight={28}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress = {()=>props.navigation.navigate('Notification')}>
                    <SvgXml
                        width={24}
                        height={24}
                        xml={notificationSvg}
                    />
                    {notify == true && <View
                        style={{
                            position: 'absolute',
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            borderWidth: 2,
                            bottom: -12,
                            left: 6,
                            borderColor: '#FFF',
                            backgroundColor: '#D82783'
                        }}
                    >
                    </View>}
                </TouchableOpacity>
            </View>
            <View style={{ width: windowWidth, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ width: 210 }}>
                    <Animated.View style={{
                        width: 97,
                        height: 1,
                        backgroundColor: '#281E30',
                        transform: [{ translateX: scrollIndicatorPosition }]
                    }} />
                </View>
            </View>
            <ScrollView
                style={{ marginTop: 20, maxWidth: windowWidth }}
                horizontal
                ref={scrollRef}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollIndicator } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Feed
                    props={props}
                    onSetExpandKey={()=>setExpandKey(expandKey+1)}
                />
                <Discover
                    props={props}
                />
            </ScrollView>
            {
                noticeCount != 0 &&
                <TouchableOpacity style={{
                    position: 'absolute',
                    top: 160,
                    left: windowWidth / 2 - 78,
                    width: noticeCount < 0 ? 183 : 156,
                    height: 40,
                    backgroundColor: noticeCount < 0 ? '#45BF58' : '#8327D8',
                    borderRadius: 34,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                    onPress={() => {
                        if (noticeCount > 0) {
                            Vibration.vibrate(100);
                        }
                        noticeDispatch("reset");
                        dispatch(setRefreshState(!refreshState));
                    }}
                >
                    <DescriptionText
                        text={noticeCount < 0 ? t("Successful upload") : (noticeCount + ' ' + t("new voices"))}
                        color='#F6EFFF'
                        marginLeft={16}
                        fontSize={15}
                        lineHeight={15}
                    />
                    <SvgXml
                        width={20}
                        height={20}
                        style={{ marginRight: 14 }}
                        xml={closeSvg}
                    />
                </TouchableOpacity>
            }
            <BottomButtons 
                active='home'
                props={props}
            />
            <RecordIcon
                props={props}
                bottom={15.5}
                expandKey={expandKey}
                left = {windowWidth/2-27}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;