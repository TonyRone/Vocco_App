import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    SafeAreaView,
    Vibration,
    KeyboardAvoidingView,
    Image,
    Text,
    ImageBackground,
    Platform
} from 'react-native';

import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import * as Progress from "react-native-progress";
import RNFetchBlob from 'rn-fetch-blob';
import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import { DescriptionText } from '../component/DescriptionText';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import { SvgXml } from 'react-native-svg';
import arrowSvg from '../../assets/chat/Arrow.svg';
import photoSvg from '../../assets/chat/photo.svg';
import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { BottomButtons } from '../component/BottomButtons';
import black_settingsSvg from '../../assets/notification/black_settings.svg';
import notificationSvg from '../../assets/discover/notification.svg';
import searchSvg from '../../assets/login/search.svg';
import new_messageSvg from '../../assets/chat/new_message.svg';

import { windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/CommenText';
import VoiceService from '../../services/VoiceService';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState, setVoiceState } from '../../store/actions';
import { RecordIcon } from '../component/RecordIcon';
import moreSvg from '../../assets/common/more.svg';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { Feed } from '../component/Feed';
import { Discover } from '../component/Discover';
import { TitleText } from '../component/TitleText';
import { FriendItem } from '../component/FriendItem';
import { NewChat } from '../component/NewChat';
import Draggable from 'react-native-draggable';
import { use } from 'i18next';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import VoicePlayer from '../Home/VoicePlayer';
import { VoiceMessageItem } from '../component/VoiceMessageItem';

const ConversationScreen = (props) => {

    let info = props.navigation.state.params.info;

    let { user, refreshState, voiceState, socketInstance } = useSelector((state) => {
        return (
            state.user
        )
    });

    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [duration, setDuration] = useState(0);
    const [key, setKey] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [fill, setFill] = useState(0);
    const [isPublish, setIsPublish] = useState(false);
    const [isOnline, setIsOnline] = useState(info.lastSeen);

    const dragPos = useRef(0);
    const wasteTime = useRef(0);
    const scrollRef = useRef();

    recorderPlayer.setSubscriptionDuration(0.2);

    const dirs = RNFetchBlob.fs.dirs;

    const path = Platform.select({
        ios: `${dirs.CacheDir}/hello.m4a`,
        android: `${dirs.CacheDir}/hello.mp3`,
    });

    const renderState = (lastSeen) => {
        if (lastSeen == "onSession") {
            return t("online")
        }
        else if (lastSeen == null) {
            return ''
        }
        return t("offline");
    }

    const getMessages = async () => {
        VoiceService.getVoiceMessages(info.user.id).then(async res => {
            const jsonRes = await res.json();
            if (res.respInfo.status == 200) {
                setMessages([...jsonRes]);
            }
            setIsLoading(false);
        })
            .catch(err => {
                console.log(err);
            })
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (path) {
            let tp = Math.max(duration, 1);
            let voiceFile = [
                { name: 'duration', data: String(Math.ceil(tp / 1000.0)) },
                { name: 'user', data: info.user.id },
                { name: 'file', filename: Platform.OS === 'android' ? 'message.mp3' : 'message.m4a', data: RNFetchBlob.wrap(String(path)) },
            ];
            VoiceService.postVoiceMessage(voiceFile).then(async res => {
                const jsonRes = await res.json();
                if (res.respInfo.status !== 201) {
                } else {
                    Vibration.vibrate(100);
                    setIsPublish(false);
                    let tp = messages;
                    tp.push(jsonRes);
                    tp.sort(onCompare);
                    setMessages([...tp]);
                    socketInstance.emit("newMessage", { info: jsonRes });
                }
                setIsLoading(false);
            })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    const clearRecorder = async () => {
        wasteTime.current = 0;
        await recorderPlayer.stopRecorder();
        recorderPlayer.removeRecordBackListener();
    }

    const onChangeRecord = async (e, v = false) => {
        if (v == true && isRecording == false) {
            onStartRecord();
        }
        if (v == false && isRecording == true) {
            onStopRecord(dragPos.current > -100)
        }
    }

    const onStopRecord = async (publish) => {
        setIsRecording(false);
        if (publish == true) {
            setDuration(wasteTime.current);
            setIsPublish(true);
        }
        clearRecorder();
    };

    const onStartRecord = async () => {
        if (isRecording == false) {
            setIsRecording(true);
            dragPos.current = 0;
            const dirs = RNFetchBlob.fs.dirs;
            const path = Platform.select({
                ios: `hello.m4a`,
                android: `${dirs.CacheDir}/hello.mp3`,
            });
            const audioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
            };
            dispatch(setVoiceState(voiceState + 1));
            await recorderPlayer.startRecorder(path, audioSet);
            recorderPlayer.addRecordBackListener((e) => {
                wasteTime.current = e.currentPosition;
                if (e.currentPosition >= fill * 1000) {
                    onStopRecord(true);
                }
            });
        }
    };

    const onDateCompare = (a, b) => {
        return new Date(a).getDate() == new Date(b).getDate() && new Date(a).getMonth() == new Date(b).getMonth()
            && new Date(a).getFullYear == new Date(b).getFullYear
    }

    const onCompare = (a, b) => {
        if (a.createdAt < b.createdAt)
            return -1;
        if (a.createdAt > b.createdAt)
            return 1;
        return 0;
    }

    useEffect(() => {
        getMessages();
        setKey(prevKey => prevKey + 1);
        setFill(user.premium == 'none' ? 60 : 180);
        socketInstance.on("receiveMessage", ({ info }) => {
            let tp = messages;
            tp.push(info);
            tp.sort(onCompare);
            setMessages([...tp]);
        });
        socketInstance.on("user_login", ({ user_id, v }) => {
            if (user_id == info.user.id)
                setIsOnline(v)
        });
        return () => clearRecorder(), socketInstance.off("receiveMessage");
    }, [])

    return (
        <ImageBackground
            source={require('../../assets/chat/Background.png')}
            resizeMode="cover"
            style={{ width: windowWidth, height: windowHeight }}
        >
            <View style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}>
                <View
                    style={[
                        { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 16, marginBottom: 8 },
                        styles.rowSpaceBetween
                    ]}
                >
                    <View style={styles.rowAlignItems}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <SvgXml
                                width={24}
                                height={24}
                                xml={arrowBendUpLeft}
                            />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: info.user.avatar.url }}
                            style={{ width: 40, height: 40, marginLeft: 25, borderRadius: 24, borderColor: '#FFA002', borderWidth: info.user.premium == 'none' ? 0 : 2 }}
                            resizeMode='cover'
                        />
                        <View style={{
                            marginLeft: 16
                        }}>
                            <SemiBoldText
                                text={info.user.name}
                                fontSize={20}
                                lineHeight={24}
                            />
                            <DescriptionText
                                text={renderState(isOnline)}
                                fontSize={13}
                                lineHeight={21}
                                color={(info.lastSeen == 'onSession') ? '#8327D8' : 'rgba(54, 36, 68, 0.8)'}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { }}>
                        <SvgXml width="24" height="24" xml={moreSvg} />
                    </TouchableOpacity>
                </View>
            </View>
            {(!isLoading && messages.length == 0) && <View style={{ position: 'absolute', bottom: 109 }}>
                <View style={{ width: windowWidth, alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: '#FFF',
                        shadowColor: 'rgba(42, 10, 111, 0.17)',
                        elevation: 10,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 57,
                        width: 250,
                        height: 188,
                        borderRadius: 16,
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                width: 54,
                                height: 54,
                                marginTop: 24
                            }}
                            source={require('../../assets/chat/dialog.png')}
                        />
                        <Text
                            numberOfLines={3}
                            style={{
                                fontFamily: "SFProDisplay-Regular",
                                fontSize: 15,
                                color: "#281E30",
                                textAlign: 'center',
                                lineHeight: 24,
                                width: 190,
                                marginTop: 18
                            }}
                        >
                            {t("You do not have any messages with Alpina yet. Let's record him something! ")}
                        </Text>

                    </View>
                </View>
                <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end', marginRight: windowWidth - 376 }}>
                    <SvgXml
                        width={141}
                        height={189}
                        xml={arrowSvg}
                    />
                </View>
            </View>}
            <ScrollView style={{ paddingHorizontal: 16 }} ref={scrollRef} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
                {messages.map((item, index) =>
                    <>
                        {(index == 0 || !onDateCompare(item.createdAt, messages[index - 1].createdAt)) &&
                        <View style={{flexDirection:'row',justifyContent:'center', marginTop:16,marginBottom:8}}>
                            <View style={{ paddingVertical:6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: 'rgba(59, 31, 82, 0.6)' }}>
                                <Text
                                    style={{
                                        fontFamily: "SFProDisplay-Regular",
                                        fontSize: 11,
                                        lineHeight: 12,
                                        color: '#F6EFFF',
                                        //textAlign: 'center',
                                    }}
                                >
                                    {
                                        new Date(item.createdAt).getDate() == new Date().getDate() &&
                                            new Date(item.createdAt).getMonth() == new Date().getMonth() ? 'Today' :(
                                            new Date(item.createdAt).getDate() == new Date().getDate()-1 &&
                                                new Date(item.createdAt).getMonth() == new Date().getMonth() ? 'Yesterday' :
                                                <>
                                                    {new Date(item.createdAt).getFullYear() + ' . '}
                                                    {new Date(item.createdAt).getMonth() + 1 + ' . '}
                                                    {new Date(item.createdAt).getDate()}
                                                </>)
                                    }
                                </Text>
                            </View>
                            </View>
                        }
                        <VoiceMessageItem
                            key={"voiceMessage" + item.id}
                            props={props}
                            info={item}
                        />
                    </>
                )}
                <View style={{height:110}}></View>
            </ScrollView>
            {!isPublish ?
                <>
                    {!isRecording && <View style={{
                        position: 'absolute',
                        bottom: 42,
                        right: windowWidth - 376,
                        width: 116,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#FFF',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity>
                            <SvgXml
                                width={24}
                                height={24}
                                style={{
                                    marginLeft: 18
                                }}
                                xml={photoSvg}
                            />
                        </TouchableOpacity>
                    </View>}
                    {isRecording && <View style={{
                        position: 'absolute',
                        bottom: 42,
                        left: 16,
                        width: 328,
                        height: 56,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                position: 'absolute',
                                height: 56,
                                width: 328,
                            }}
                            resizeMode="stretch"
                            source={require('../../assets/chat/chatRecord.png')}
                        />
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                marginLeft: 24,
                                borderRadius: 4,
                                backgroundColor: "#E41717"
                            }}
                        ></View>
                        <CountdownCircleTimer
                            key={key}
                            isPlaying={isRecording}
                            duration={fill}
                            size={57}
                            strokeWidth={0}
                            trailColor="#D4C9DE"
                            trailStrokeWidth={0}
                            onComplete={() => onStopRecord(true)}
                            colors={[
                                ['#B35CF8', 0.4],
                                ['#8229F4', 0.4],
                                ['#8229F4', 0.2],
                            ]}
                        >
                            {({ remainingTime, animatedColor }) => {
                                return (
                                    <DescriptionText
                                        text={new Date(wasteTime.current).toISOString().substr(14, 5)}
                                        lineHeight={24}
                                        color="rgba(54, 36, 68, 0.8)"
                                        fontSize={15}
                                    />
                                )
                            }}
                        </CountdownCircleTimer>
                    </View>}

                    <View style={{ position: 'absolute', bottom: isRecording ? 104 : 98, width: '100%', alignItems: 'center' }}>
                        <Draggable
                            key={key}
                            x={isRecording ? 314 : 320}
                            y={0}
                            shouldReverse={true}
                            minX={200}
                            maxX={windowWidth - 16}
                            minY={0}
                            maxY={0}
                            touchableOpacityProps={{
                                activeOpactiy: 0.1,
                            }}
                            onDrag={(event, gestureState) => {
                            }}
                            onDragRelease={(event, gestureState, bounds) => {
                                dragPos.current = gestureState.dx;
                            }}
                            onReverse={() => {

                            }}

                        >
                            <View
                                onTouchStart={(e) => onChangeRecord(e, true)}
                                onTouchEnd={(e) => onChangeRecord(e, false)}
                            >
                                <SvgXml
                                    width={isRecording ? 68 : 56}
                                    height={isRecording ? 68 : 56}
                                    xml={recordSvg}
                                />
                            </View>
                        </Draggable>
                    </View>
                </>
                :
                <View style={{
                    position: 'absolute',
                    width: windowWidth,
                    bottom: 42,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingRight: 12,
                            paddingVertical: 8,
                            backgroundColor: '#FFF',
                            shadowColor: 'rgba(176, 148, 235, 1)',
                            elevation: 10,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            borderRadius: 30,
                        }}
                    >
                        <VoicePlayer
                            playBtn={true}
                            waveColor={info.user.premium != 'none' ? ['#FFC701', '#FFA901', '#FF8B02'] : ['#D89DF4', '#B35CF8', '#8229F4']}
                            playing={false}
                            stopPlay={() => { }}
                            startPlay={() => { }}
                            tinWidth={windowWidth / 300}
                            mrg={windowWidth / 600}
                            duration={duration}
                        />
                        <TouchableOpacity onPress={() => setIsPublish(false)}>
                            <SvgXml
                                width={24}
                                height={24}
                                xml={redTrashSvg}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity disabled={isLoading} onPress={handleSubmit}>
                        <Image
                            style={{
                                height: 56,
                                width: 56,
                                marginLeft: 4
                            }}
                            resizeMode="stretch"
                            source={require('../../assets/post/answerPublish.png')}
                        />
                    </TouchableOpacity>
                </View>
            }
            {isLoading &&
                <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(1,1,1,0.3)' }}>
                    <View style={{ marginTop: windowHeight / 2.5, alignItems: 'center', width: windowWidth }}>
                        <Progress.Circle
                            indeterminate
                            size={30}
                            color="rgba(0, 0, 255, 0.7)"
                            style={{ alignSelf: "center" }}
                        />
                    </View>
                </View>
            }
        </ImageBackground>
    )
}

export default ConversationScreen;
