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
    Text
} from 'react-native';

import * as Progress from "react-native-progress";
import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import closeSvg from '../../assets/common/close.svg';
import { BottomButtons } from '../component/BottomButtons';
import black_settingsSvg from '../../assets/notification/black_settings.svg';
import notificationSvg from '../../assets/discover/notification.svg';
import searchSvg from '../../assets/login/search.svg';
import new_messageSvg from '../../assets/chat/new_message.svg';

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
import { FriendItem } from '../component/FriendItem';
import { NewChat } from '../component/NewChat';

const ChatScreen = (props) => {

    let { user, refreshState } = useSelector((state) => {
        return (
            state.user
        )
    });

    const { t, i18n } = useTranslation();

    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFriendsList, setShowFriendsList] = useState(false);

    const getFollowUsers = () => {
        VoiceService.getFollows(user.id, "Following").then(async res => {
            if (res.respInfo.status === 200) {
                const jsonRes = await res.json();
                setFriends(jsonRes);
            }
            setIsLoading(false);
        })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getFollowUsers();
    }, [])

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
                            key={index + item.id + 'friendItem_chat'}
                            props={props}
                            info={item}
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
                    alignItems:'center'
                }}>
                    <Image
                        source={require('../../assets/chat/illustration.png')}
                        style={{ width: windowWidth, height: windowWidth / 2, marginTop: 50 }}
                        resizeMode='center'
                    />
                    <Text
                        numberOfLines={2}
                        style={{
                            fontFamily: "SFProDisplay-Regular",
                            fontSize: 17,
                            color: '#281E30',
                            textAlign: 'center',
                            lineHeight: 28,
                            width:182,
                            marginTop:22
                        }}
                    >
                        {t("You have no conversations yet")}
                    </Text>
                    <TouchableOpacity onPress={()=>setShowFriendsList(true)} style={[styles.rowAlignItems,{marginTop:18}]}>
                        <SvgXml
                            width={24}
                            height={24}
                            xml={new_messageSvg}
                        />
                        <CommenText
                            text={t("New message")}
                            fontSize={15}
                            lineHeight={24}
                            color='#8327D8'
                            marginLeft={10}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading && <Progress.Circle
                indeterminate
                size={30}
                color="rgba(0, 0, 255, .7)"
                style={{ alignSelf: "center", marginTop: 50 }}
            />}
            <BottomButtons
                active='chat'
                props={props}
            />
            <RecordIcon
                props={props}
                bottom={15.5}
                left={windowWidth / 2 - 27}
            />
            {showFriendsList&&<NewChat
                props={props}
                onCloseModal={()=>setShowFriendsList(false)}
            />}
        </KeyboardAvoidingView>
    )
}

export default ChatScreen;
