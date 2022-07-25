import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Image,
    Text,
    ImageBackground,
    Platform,
    Pressable
} from 'react-native';

import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import * as Progress from "react-native-progress";
import RNVibrationFeedback from 'react-native-vibration-feedback';
import { Menu } from 'react-native-material-menu';
import RNFetchBlob from 'rn-fetch-blob';
import { recorderPlayer } from '../Home/AudioRecorderPlayer';
import { NavigationActions, StackActions } from 'react-navigation';
import { DescriptionText } from '../component/DescriptionText';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import trashSvg from '../../assets/chat/trash.svg';
import replySvg from '../../assets/chat/reply.svg';
import selectSvg from '../../assets/chat/select.svg';
import closeSvg from '../../assets/chat/close.svg';
import { SvgXml } from 'react-native-svg';
import arrowSvg from '../../assets/chat/Arrow.svg';
import photoSvg from '../../assets/chat/photo.svg';
import disableNotificationSvg from '../../assets/chat/disable_notification.svg';
import recordSvg from '../../assets/common/bottomIcons/record.svg';

import { Avatars, windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/SemiBoldText';
import VoiceService from '../../services/VoiceService';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageCount, setRefreshState, setVoiceState } from '../../store/actions';
import moreSvg from '../../assets/common/more.svg';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import Draggable from 'react-native-draggable';
import { use } from 'i18next';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import VoicePlayer from '../Home/VoicePlayer';
import { MessageItem } from '../component/MessageItem';
import { TitleText } from '../component/TitleText';
import { PhotoSelector } from '../component/PhotoSelector';

const ConversationScreen = (props) => {

    let info = props.navigation.state.params.info;
    let recordId = props.navigation.state.params.recordId;

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
    const [replyIdx, setReplyIdx] = useState(-1);
    const [fill, setFill] = useState(0);
    const [isPublish, setIsPublish] = useState(false);
    const [isOnline, setIsOnline] = useState(info.lastSeen);
    const [visible, setVisible] = useState(false);
    const [isSelectingPhoto, setIsSelectingPhoto] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [otherState, setOtherState] = useState('');

    const mounted = useRef(false);

    const hideMenu = () => setVisible(false);

    const showMenu = () => setVisible(true);

    const dragPos = useRef(0);
    const wasteTime = useRef(0);
    const scrollRef = useRef();

    recorderPlayer.setSubscriptionDuration(0.2);

    const dirs = RNFetchBlob.fs.dirs;

    const path = Platform.select({
        ios: `${dirs.CacheDir}/hello.m4a`,
        android: `${dirs.CacheDir}/hello.mp3`,
    });

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const onNavigate = (des, par = null) => {
        const resetActionTrue = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: des, params: par })],
        });
        props.navigation.dispatch(resetActionTrue);
    }

    const renderState = (lastSeen) => {
        if (lastSeen == "onSession") {
            if (otherState == 'start')
                return t("Recording...");
            return t("online")
        }
        else if (lastSeen == null) {
            return ''
        }
        return t("offline");
    }

    const renderTime = (v) => {
        const updatedTime = new Date(v);
        const nowTime = new Date();
        if (updatedTime.getFullYear() != nowTime.getFullYear()) {
            return updatedTime.toDateString().substring(4);
        }
        else if (nowTime.getMonth() != updatedTime.getMonth() || (nowTime.getDate() - updatedTime.getDate() > nowTime.getDay())) {
            return t(months[updatedTime.getMonth()]) + ' ' + updatedTime.getDate().toString();
        }
        else if (nowTime.getDate() - 1 > updatedTime.getDate()) {
            return t(days[updatedTime.getDay()]);
        }
        else if (nowTime.getDate() - 1 == updatedTime.getDate()) {
            return t("Yesterday")
        }
        else {
            return t("Today")
        }
    }

    const getMessages = async () => {
        VoiceService.getMessages(info.user.id).then(async res => {
            const jsonRes = await res.json();
            if (res.respInfo.status == 200 && mounted.current) {
                setMessages(jsonRes);
                setIsLoading(false);
            }
        })
            .catch(err => {
                console.log(err);
            })
    }

    const sendRecordMessage = () => {
        setIsLoading(true);
        let sendFile = [
            { name: 'user', data: info.user.id },
            { name: 'record', data: recordId },
            { name: 'type', data: 'record' },
        ];
        VoiceService.postMessage(sendFile).then(async res => {
            const jsonRes = await res.json();
            if (res.respInfo.status !== 201) {
            } else if (mounted.current) {
                getMessages();
                socketInstance.emit("newMessage", { info: jsonRes });
            }
        })
            .catch(err => {
                console.log(err);
            });
    }

    const handleSubmit = async (fileType, v, replyIndex) => {
        setIsLoading(true);
        let fileName = '', filePath = '';
        if (fileType == 'voice') {
            fileName = Platform.OS === 'android' ? 'message.mp3' : 'message.m4a';
            filePath = RNFetchBlob.wrap(String(path));
        }
        else if (fileType == 'photo') {
            fileName = v.fileName;
            let fileUri = Platform.OS == 'android' ? v.uri : decodeURIComponent(v.uri.replace('file://', ''));
            filePath = RNFetchBlob.wrap(fileUri);
        }
        let tp = Math.max(duration, 1);
        let sendFile = [
            { name: 'duration', data: String(Math.ceil(tp / 1000.0)) },
            { name: 'user', data: info.user.id },
            { name: 'type', data: fileType },
            { name: 'file', filename: fileName, data: filePath },
        ];
        if (replyIndex >= 0)
            sendFile.push({ name: 'ancestor', data: messages[replyIndex].id });
        if (fileType == 'emoji')
            sendFile.push({ name: 'emoji', data: v });
        VoiceService.postMessage(sendFile).then(async res => {
            const jsonRes = await res.json();
            if (res.respInfo.status !== 201) {
            } else if (mounted.current) {
                RNVibrationFeedback.vibrateWith(1519);
                setIsPublish(false);
                let tp = messages;
                tp.push(jsonRes);
                tp.sort(onCompare);
                setMessages([...tp]);
                socketInstance.emit("newMessage", { info: jsonRes });
                setIsLoading(false);
            }
        })
            .catch(err => {
                console.log(err);
            });
        setReplyIdx(-1);
    }

    const sendEmoji = (icon, index) => {
        handleSubmit("emoji", icon, index);
    }

    const onConfirmMessage = () => {
        VoiceService.confirmMessage(info.user.id);
    }

    const clearRecorder = async () => {
        wasteTime.current = 0;
        await recorderPlayer.stopRecorder()
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            });
        recorderPlayer.removeRecordBackListener();
    }

    const onChangeRecord = async (e, v = false) => {
        if (v == true && isRecording == false) {
            RNVibrationFeedback.vibrateWith(1519);
            onStartRecord();
        }
        if (v == false && isRecording == true) {
            onStopRecord(dragPos.current > -100 && wasteTime.current > 0)
        }
    }

    const onStopRecord = async (publish) => {
        setIsRecording(false);
        if (publish == true) {
            setDuration(wasteTime.current);
            setIsPublish(true);
        }
        else
            setReplyIdx(-1);
        socketInstance.emit("chatState", { fromUserId: user.id, toUserId: info.user.id, state: 'stop' });
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
            socketInstance.emit("chatState", { fromUserId: user.id, toUserId: info.user.id, state: 'start' });
            await recorderPlayer.startRecorder(path, audioSet).then(res => {
            })
                .catch(err => {
                    console.log(err);
                });
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

    const loginListener = ({ user_id, v }) => {
        if (user_id == info.user.id)
            setIsOnline(v)
    }

    const stateListener = ({ fromUserId, toUserId, state }) => {
        if (fromUserId == info.user.id && toUserId == user.id)
            setOtherState(state);
    }

    const onClearChat = () => {
        let chatIds = selectedItems.map((e) => messages[e].id);
        VoiceService.deleteMessages({ messageIds: chatIds });
        setMessages(prev => {
            prev = prev.filter((e, index) => selectedItems.indexOf(index) == -1);
            return [...prev]
        })
        setSelectedItems([]);
        setIsSelecting(false);
    }

    const onClearAllChat = () => {
        let chatIds = messages.map((e) => e.id);
        VoiceService.deleteMessages({ messageIds: chatIds });
        setMessages([]);
        setSelectedItems([]);
        setIsSelecting(false);
    }

    const onDeleteItem = (idx) => {
        let ids = [];
        ids.push(messages[idx].id);
        VoiceService.deleteMessages({ messageIds: ids });
        setMessages(prev => {
            prev.splice(idx, 1);
            return [...prev]
        })
    }

    const onSelectItem = (idx) => {
        if (isSelecting == false)
            setIsSelecting(true);
        setSelectedItems(prev => {
            let selectedIdx = prev.indexOf(idx);
            if (selectedIdx == -1)
                prev.push(idx);
            else
                prev.splice(selectedIdx, 1);
            return [...prev];
        })
    }

    useEffect(() => {
        mounted.current = true;
        dispatch(setMessageCount(0));
        if (recordId) {
            sendRecordMessage();
        }
        else
            getMessages();
        setKey(prevKey => prevKey + 1);
        setFill(user.premium == 'none' ? 60 : 180);
        socketInstance.on("receiveMessage", ({ info }) => {
            setMessages((prev) => {
                prev.push(info);
                prev.sort(onCompare);
                return [...prev];
            });
            onConfirmMessage();
        });
        socketInstance.on("chatState", stateListener);
        socketInstance.on("user_login", loginListener);
        socketInstance.emit("chatState", { fromUserId: user.id, toUserId: info.user.id, state: 'confirm' });
        // if (Platform.OS === 'android')
        //     requestCameraPermission();
        return () => {
            mounted.current = false;
            clearRecorder();
            socketInstance.off('receiveMessage');
            socketInstance.off('user_login', loginListener);
            socketInstance.off('chatState', stateListener);
            //dispatch(setRefreshState(!refreshState));
        };
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
                {!isSelecting ?
                    <View
                        style={[
                            { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 16, marginBottom: 8 },
                            styles.rowSpaceBetween
                        ]}
                    >
                        <View style={styles.rowAlignItems}>
                            <TouchableOpacity onPress={() => onNavigate("Chat")}>
                                <SvgXml
                                    width={32}
                                    height={32}
                                    xml={arrowBendUpLeft}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rowAlignItems}
                                onPress={() => props.navigation.navigate('UserProfile', { userId: info.user.id })}
                            >
                                <View
                                    onPress={() => props.navigation.navigate('UserProfile', { userId: info.user.id })}
                                >
                                    <Image
                                        source={info.user.avatar ? { uri: info.user.avatar.url } : Avatars[info.user.avatarNumber].uri}
                                        style={{ width: 40, height: 40, marginLeft: 25, borderRadius: 24, borderColor: '#FFA002', borderWidth: info.user.premium == 'none' ? 0 : 2 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <View style={{
                                    marginLeft: 16
                                }}>
                                    <View
                                        onPress={() => props.navigation.navigate('UserProfile', { userId: info.user.id })}
                                    >
                                        <SemiBoldText
                                            text={info.user.name}
                                            fontSize={20}
                                            lineHeight={24}
                                        />
                                    </View>
                                    <DescriptionText
                                        text={renderState(isOnline)}
                                        fontSize={13}
                                        lineHeight={21}
                                        color={(isOnline == 'onSession') ? '#8327D8' : 'rgba(54, 36, 68, 0.8)'}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Menu
                            visible={visible}
                            anchor={
                                <Pressable onPress={showMenu}>
                                    <SvgXml width="24" height="24" xml={moreSvg} />
                                </Pressable>
                            }
                            style={{
                                width: 250,
                                height: 129,
                                borderRadius: 16,
                                backgroundColor: '#FFF'
                            }}
                            onRequestClose={hideMenu}
                        >
                            <TouchableOpacity
                                style={styles.contextMenu}
                                onPress={() => { setIsSelecting(!isSelecting); hideMenu(); }}
                            >
                                <TitleText
                                    text={t("Select")}
                                    fontSize={17}
                                    fontFamily="SFProDisplay-Regular"
                                />
                                <SvgXml
                                    width={20}
                                    height={20}
                                    xml={selectSvg}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contextMenu}
                                onPress={() => hideMenu()}
                            >
                                <TitleText
                                    text={t("Disable Notification")}
                                    fontSize={17}
                                    fontFamily="SFProDisplay-Regular"
                                />
                                <SvgXml
                                    width={20}
                                    height={20}
                                    xml={disableNotificationSvg}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.contextMenu, { borderBottomWidth: 0 }]}
                                onPress={() => { onClearAllChat(); hideMenu() }}
                            >
                                <TitleText
                                    text={t("Clear chat")}
                                    fontSize={17}
                                    color='#E41717'
                                    fontFamily="SFProDisplay-Regular"
                                />
                                <SvgXml
                                    width={20}
                                    height={20}
                                    xml={trashSvg}
                                />
                            </TouchableOpacity>
                        </Menu>
                    </View>
                    :
                    <View
                        style={[
                            { marginTop: Platform.OS == 'ios' ? 56 : 26, paddingHorizontal: 12, marginBottom: 10 },
                            styles.rowSpaceBetween
                        ]}
                    >
                        <TouchableOpacity onPress={() => onClearChat()}>
                            <DescriptionText
                                text={t("Clear chat")}
                                fontSize={17}
                                lineHeight={28}
                                color='#8327D8'
                            />
                        </TouchableOpacity>
                        <SemiBoldText
                            text={`${selectedItems.length}` + t("selected")}
                            fontSize={17}
                            lineHeight={28}
                        />
                        <TouchableOpacity onPress={() => { setSelectedItems([]); setIsSelecting(false); }}>
                            <DescriptionText
                                text={t("Clean")}
                                fontSize={17}
                                lineHeight={28}
                                color='#8327D8'
                            />
                        </TouchableOpacity>
                    </View>
                }
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
                            {t("Your chat with") + ` ${info.user.name} ` + t("is empty! Start chatting now!")}
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
            <ScrollView style={{ paddingHorizontal: 8 }} ref={scrollRef} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
                {messages.map((item, index) => {
                    let ancestorIdx = null;
                    if (item.ancestorId) {
                        ancestorIdx = messages.findIndex(msg => (msg.id == item.ancestorId));
                    }
                    return <View key={"message" + item.id}>
                        {(index == 0 || !onDateCompare(item.createdAt, messages[index - 1].createdAt)) &&
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 8 }}>
                                <View style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: 'rgba(59, 31, 82, 0.6)' }}>
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
                                            renderTime(item.createdAt)
                                        }
                                    </Text>
                                </View>
                            </View>
                        }
                        <MessageItem
                            props={props}
                            info={item}
                            ancestorInfo={ancestorIdx != null ? messages[ancestorIdx] : null}
                            isSelect={isSelecting ? (selectedItems.indexOf(index) == -1 ? 0 : 1) : -1}
                            onDeleteItem={() => onDeleteItem(index)}
                            onSelectItem={() => onSelectItem(index)}
                            onReplyMsg={() => setReplyIdx(index)}
                            onSendEmoji={(v) => sendEmoji(v, index)}
                        />
                    </View>
                })}
                <View style={{ height: 110 }}></View>
            </ScrollView>
            {!isPublish ?
                <>
                    {!isRecording && <View style={{
                        position: 'absolute',
                        bottom: 42,
                        right: windowWidth - 376,
                        width: replyIdx == -1 ? 116 : 343,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#FFF',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {replyIdx != -1 && <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: 212,
                            marginLeft: 16
                        }}>
                            <View style={styles.rowAlignItems}>
                                <SvgXml
                                    width={20}
                                    height={20}
                                    xml={replySvg}
                                />
                                <View style={{ marginLeft: 16 }}>
                                    <DescriptionText
                                        text={info.user.name}
                                        fontSize={15}
                                        lineHeight={24}
                                        color='#8327D8'
                                    />
                                    <DescriptionText
                                        text="voice message"
                                        fontSize={12}
                                        lineHeight={16}
                                        color='rgba(59, 31, 82, 0.6)'
                                    />
                                </View>
                            </View>
                            <View style={styles.rowAlignItems}>
                                <TouchableOpacity onPress={() => setReplyIdx(-1)}>
                                    <SvgXml
                                        width={24}
                                        height={24}
                                        xml={closeSvg}
                                    />
                                </TouchableOpacity>
                                <View style={{
                                    height: 32,
                                    width: 1.5,
                                    backgroundColor: '#F2F0F5',
                                    marginLeft: 8,
                                }}>
                                </View>
                            </View>
                        </View>
                        }
                        {/* <TouchableOpacity style={{
                            marginLeft: 12
                        }}
                            onPress={() => setVisibleReaction(true)}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: 'white',
                                }}
                            >
                                {"😁"}
                            </Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => setIsSelectingPhoto(true)}>
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
                        <ImageBackground
                            style={{
                                position: 'absolute',
                                height: 56,
                                width: 328,
                                justifyContent:'center'
                            }}
                            resizeMode="stretch"
                            source={require('../../assets/chat/chatRecord.png')}
                        >
                            <DescriptionText
                                text={t("Swipe to Cancel")}
                                fontSize={13}
                                lineHeight={13}
                                color='#E41717'
                                marginLeft={188}
                            />
                        </ImageBackground>
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
                                if (gestureState.dx <= -100) {
                                    RNVibrationFeedback.vibrateWith(1519);
                                    setTimeout(() => {
                                        RNVibrationFeedback.vibrateWith(1519);
                                    }, 300);
                                }
                            }}
                            onReverse={() => {

                            }}

                        >
                            <View
                                onTouchStart={(e) => onChangeRecord(e, true)}
                                onTouchEnd={(e) => onChangeRecord(e, false)}
                                style={{
                                    opacity: isRecording ? 0.1 : 1
                                }}
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
                            borderRadius: 30,
                            // shadowColor: 'rgba(176, 148, 235, 1)',
                            // elevation: 10,
                            // shadowOffset: { width: 0, height: 2 },
                            // shadowOpacity: 0.5,
                            // shadowRadius: 8,
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
                    <TouchableOpacity disabled={isLoading} onPress={() => handleSubmit('voice', null, replyIdx)}>
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
            {isSelectingPhoto &&
                <PhotoSelector
                    onSendPhoto={(v) => { setIsSelectingPhoto(false); handleSubmit('photo', v, replyIdx); }}
                    onCloseModal={() => setIsSelectingPhoto(false)}
                />
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
