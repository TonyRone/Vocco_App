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
import { Menu } from 'react-native-material-menu';
import RNFetchBlob from 'rn-fetch-blob';
import { recorderPlayer } from '../Home/AudioRecorderPlayer';
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

import { windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/CommenText';
import VoiceService from '../../services/VoiceService';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshState, setVoiceState } from '../../store/actions';
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

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const renderState = (lastSeen) => {
        if (lastSeen == "onSession") {
            if (otherState == 'startRecording')
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
        else if (nowTime.getDate() - updatedTime.getDate() > nowTime.getDay()) {
            return updatedTime.toDateString().substring(4, 10);
        }
        else if (nowTime.getDate() - 1 > updatedTime.getDate()) {
            return days[updatedTime.getDay()];
        }
        else if (nowTime.getDate() - 1 == updatedTime.getDate()) {
            return 'Yesterday'
        }
        else {
            return 'Today'
        }
    }

    const getMessages = async () => {
        VoiceService.getMessages(info.user.id).then(async res => {
            const jsonRes = await res.json();
            if (res.respInfo.status == 200) {
                setMessages(jsonRes);
            }
            setIsLoading(false);
        })
            .catch(err => {
                console.log(err);
            })
    }

    const handleSubmit = async (fileType, v) => {
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
            { name: 'ancestor', data: (replyIdx >= 0 ? messages[replyIdx].id : null) },
            { name: 'file', filename: fileName, data: filePath },
        ];
        VoiceService.postMessage(sendFile).then(async res => {
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
        setReplyIdx(-1);
    }

    const onConfirmMessage = () => {
        VoiceService.confirmMessage(info.user.id);
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
        else
            setReplyIdx(-1);
        socketInstance.emit("chatState", { toUserId: info.user.id, state: 'stopRecording' });
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
            socketInstance.emit("chatState", { toUserId: info.user.id, state: 'startRecording' });
            await recorderPlayer.startRecorder(path, audioSet);
            recorderPlayer.addRecordBackListener((e) => {
                wasteTime.current = e.currentPosition;
                if (e.currentPosition >= fill * 1000) {
                    onStopRecord(true);
                }
            });
        }
    };

    // const onSelectPhotos = async () => {
    //     let defaultOptions = {
    //         //**iOS**//
    //         usedPrefetch: false,
    //         allowedAlbumCloudShared: false,
    //         muteAudio: true,
    //         autoPlay: true,
    //         //resize thumbnail
    //         haveThumbnail: true,
    //         thumbnailWidth: Math.round(windowWidth / 2),
    //         thumbnailHeight: Math.round(windowWidth / 2),
    //         allowedLivePhotos: true,
    //         preventAutomaticLimitedAccessAlert: true, // newest iOS 14
    //         emptyMessage: 'No albums',
    //         selectedColor: '#30475e',
    //         maximumMessageTitle: 'Notification',
    //         maximumMessage: 'You have selected the maximum number of media allowed',
    //         messageTitleButton: 'OK',
    //         cancelTitle: 'Cancel',
    //         tapHereToChange: 'Tap here to change',
    //         //****//
    //         //**Android**//
    //         //****//
    //         //**Both**//
    //         usedCameraButton: true,
    //         allowedVideo: false,
    //         allowedPhotograph: true, // for camera : allow this option when you want to take a photos
    //         allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
    //         maxVideoDuration: 60, //for camera : max video recording duration
    //         numberOfColumn: 3,
    //         maxSelectedAssets: 20,
    //         singleSelectedMode: false,
    //         doneTitle: 'Done',
    //         isPreview: true,
    //         mediaType: 'all',
    //         isExportThumbnail: false,
    //         //****//
    //         // fetchOption: Object,
    //         // fetchCollectionOption: Object,
    //         // emptyImage: Image,
    //     };
    //     const response = await MultipleImagePicker.openPicker(defaultOptions);
    // }

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

    const listener = ({ user_id, v }) => {
        if (user_id == info.user.id)
            setIsOnline(v)
    }

    const onClearChat = () => {
        let chatIds = selectedItems.map((e) => messages[e].id);
        VoiceService.deleteMessages({ messageIds: chatIds }).then(async res => {
        })
            .catch(err => {
                console.log(err);
            })
        setMessages(prev => {
            prev = prev.filter((e, index) => selectedItems.indexOf(index) == -1);
            return [...prev]
        })
        setSelectedItems([]);
        setIsSelecting(false);
    }

    const onClearAllChat = () => {
        let chatIds = messages.map((e) => e.id);
        VoiceService.deleteMessages({ messageIds: chatIds }).then(async res => {
        })
            .catch(err => {
                console.log(err);
            })
        setMessages([]);
        setSelectedItems([]);
        setIsSelecting(false);
    }

    const onDeleteItem = (idx) => {
        let ids = [];
        ids.push(messages[idx].id);
        VoiceService.deleteMessages({ messageIds: ids }).then(async res => {
        })
            .catch(err => {
                console.log(err);
            });
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
        socketInstance.on("chatState", (v) => {
            setOtherState(v);
        });
        socketInstance.on("user_login", listener);
        // if (Platform.OS === 'android')
        //     requestCameraPermission();
        return () => {
            clearRecorder();
            socketInstance.off('receiveMessage');
            socketInstance.off('user_login', listener);
            socketInstance.off('chatState');
            dispatch(setRefreshState(!refreshState));
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
                            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                                <SvgXml
                                    width={24}
                                    height={24}
                                    xml={arrowBendUpLeft}
                                />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: info.user.avatar?.url }}
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
                                    color={(isOnline == 'onSession') ? '#8327D8' : 'rgba(54, 36, 68, 0.8)'}
                                />
                            </View>
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
                                style={styles.contextMenu}
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
                            text={`${selectedItems.length} Selected`}
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
                            {t(`You do not have any messages with ${info.user.name} yet. Let's record him something! `)}
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
                            onReplyMsg={() => { setReplyIdx(index); }}
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
                    <TouchableOpacity disabled={isLoading} onPress={() => handleSubmit('voice')}>
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
                    onSendPhoto={(v) => { setIsSelectingPhoto(false); handleSubmit('photo', v); }}
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
