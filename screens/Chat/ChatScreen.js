import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Text
} from 'react-native';

import * as Progress from "react-native-progress";
import { SvgXml } from 'react-native-svg';
import { BottomButtons } from '../component/BottomButtons';
import black_settingsSvg from '../../assets/notification/black_settings.svg';
import searchSvg from '../../assets/login/search.svg';
import new_messageSvg from '../../assets/chat/new_message.svg';

import { windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { SemiBoldText } from '../component/SemiBoldText';
import VoiceService from '../../services/VoiceService';
import { useSelector } from 'react-redux';
import { RecordIcon } from '../component/RecordIcon';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { TitleText } from '../component/TitleText';
import { FriendItem } from '../component/FriendItem';
import { NewChat } from '../component/NewChat';
import { ChatListItem } from '../component/ChatListItem';

const ChatScreen = (props) => {

    let { user, refreshState, socketInstance } = useSelector((state) => {
        return (
            state.user
        )
    });

    const { t, i18n } = useTranslation();

    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFriendsList, setShowFriendsList] = useState(false);
    const [conversations, setConversations] = useState([]);

    const getFollowUsers = () => {
        VoiceService.getFollows(user.id, "Following")
            .then(async res => {
                if (res.respInfo.status === 200) {
                    const jsonRes = await res.json();
                    setFriends(jsonRes);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getConversations = () => {
        VoiceService.getConversations()
            .then(async res => {
                if (res.respInfo.status === 200) {
                    const jsonRes = await res.json();
                    const userIds = jsonRes.map((item) => {
                        if (item.sender.id == user.id)
                            return item.receiver.id;
                        return item.sender.id;
                    });
                    socketInstance.emit("getUsersState", userIds, (res) => {
                        let tp = jsonRes.map((item, index) => {
                            let temp = item;
                            temp.lastSeen = res[index];
                            return temp;
                        })
                        setConversations([...tp]);
                        setIsLoading(false);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const listener =  ({ user_id, v }) => {
        setConversations(prev => {
            let idx = 0;
            for (; idx < prev.length; idx++)
                if (prev[idx].sender.id == user_id || prev[idx].receiver.id == user_id) break;
            if (idx != prev.length) {
                prev[idx].lastSeen = v;
                return [...prev];
            }
            return prev;
        })
    }

    useEffect(() => {
        getFollowUsers();
        getConversations();
        socketInstance.on("user_login", listener);
       return ()=>socketInstance.off("user_login", listener);
    }, [refreshState])

    return (
        <KeyboardAvoidingView
            style={{
                backgroundColor: '#FFF',
                flex: 1,
            }}
        >
            <View style={{
                backgroundColor: "#F8F0FF",
                borderBottomLeftRadius: 30
            }}>
                <View
                    style={[
                        { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 20, marginBottom: 24 },
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
                    <TouchableOpacity onPress={() => setShowFriendsList(true)}>
                        <SvgXml
                            width="24"
                            height="24"
                            xml={searchSvg}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        paddingRight: 16,
                        height: 95
                    }}
                >
                    {friends.map((item, index) =>
                        <FriendItem
                            key={index + 'friendItem_chat'}
                            props={props}
                            info={item}
                            type = 'user'
                            isUserName={true}
                        />)
                    }
                </ScrollView>
            </View>
            <View style={{
                flex: 1,
                backgroundColor: "#F8F0FF",
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    borderTopRightRadius: 30,
                    alignItems: 'center'
                }}>
                    {(isLoading == false && conversations.length == 0) && <>
                        <Image
                            source={require('../../assets/chat/illustration.png')}
                            style={{ width: windowWidth, height: windowWidth / 2, marginTop: 50 }}
                        />
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: "SFProDisplay-Regular",
                                fontSize: 17,
                                color: '#281E30',
                                textAlign: 'center',
                                lineHeight: 28,
                                width: 182,
                                marginTop: 22
                            }}
                        >
                            {t("You have no conversations yet")}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFriendsList(true)} style={[styles.rowAlignItems, { marginTop: 18 }]}>
                            <SvgXml
                                width={24}
                                height={24}
                                xml={new_messageSvg}
                            />
                            <SemiBoldText
                                text={t("New message")}
                                fontSize={15}
                                lineHeight={24}
                                color='#8327D8'
                                marginLeft={10}
                            />
                        </TouchableOpacity>
                    </>}
                    <ScrollView>
                        {
                            conversations.map((item, index) =>
                                <ChatListItem
                                    key={"chatListItem" + index.toString()}
                                    props={props}
                                    info={item}
                                />
                            )
                        }
                    </ScrollView>
                    {isLoading == true && <Progress.Circle
                        indeterminate
                        size={30}
                        color="rgba(0, 0, 255, .7)"
                        style={{ alignSelf: "center", marginTop: 70 }}
                    />}
                </View>
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
            {showFriendsList && <NewChat
                props={props}
                onCloseModal={() => setShowFriendsList(false)}
            />}
        </KeyboardAvoidingView>
    )
}

export default ChatScreen;
