import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Pressable,
    ScrollView
} from "react-native";

import { useTranslation } from 'react-i18next';
import '../../language/i18n'
import { DescriptionText } from "./DescriptionText";

import { SvgXml } from 'react-native-svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import voiceMessageSvg from '../../assets/chat/voice_message.svg';
import singleCheckSvg from '../../assets/chat/single-check.svg';
import doubleCheckSvg from '../../assets/chat/double-check.svg';
import lightSingleCheckSvg from '../../assets/chat/light-single-check.svg';
import lightDoubleCheckSvg from '../../assets/chat/light-double-check.svg';
import yellow_starSvg from '../../assets/common/yellow_star.svg';

import whiteTrashSvg from '../../assets/notification/white_trash.svg'

import { styles } from '../style/Common';
import { SemiBoldText } from "./CommenText";
import { windowWidth } from "../../config/config";
import { produceWithPatches } from 'immer';
import { useSelector } from 'react-redux';

export const ChatListItem = ({
    props,
    info
}) => {

    let { user } = useSelector((state) => {
        return (
            state.user
        )
    });

    let otherUser = user.id == info.sender.id ? info.receiver : info.sender;

    const { t, i18n } = useTranslation();

    const renderTime = () => {
        const updatedTime = new Date(info.updatedAt);
        const nowTime = new Date();
        if (updatedTime.getFullYear() != nowTime.getFullYear()) {
            return updatedTime.toDateString().substring(4);
        }
        else if (nowTime.getDate() - updatedTime.getDate() > nowTime.getDay()) {
            return updatedTime.toDateString().substring(4, 10);
        }
        else if (nowTime.getDate() > updatedTime.getDate()) {
            return updatedTime.toDateString().substring(0, 3);
        }
        else {
            return updatedTime.toISOString().substr(11, 5);
        }
    }

    const renderState = () => {
        if (user.id == info.sender.id) {
            if (info.newsCount > 0) {
                return <View style={{ width: 31, height: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <SvgXml
                        width={10.5}
                        height={6.5}
                        xml={info.lastSeen == 'onSession' ? singleCheckSvg : lightSingleCheckSvg}
                    />
                </View>
            }
            else {
                return <View style={{ width: 31, height: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <SvgXml
                        width={20}
                        height={20}
                        xml={info.lastSeen == 'onSession' ? doubleCheckSvg : lightDoubleCheckSvg}
                    />
                </View>

            }
        }
        else {
            if (info.newsCount > 0) {
                return <View
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 10,
                        backgroundColor: info.lastSeen == 'onSession' ? '#8327D8' : '#B3A3C2',
                    }}
                >
                    <DescriptionText
                        text={info.newsCount}
                        fontSize={11}
                        lineHeight={12}
                        color='#FFF'
                    />
                </View>

            }
            else {
                return <View style={{ windowWidth: 10, height: 20 }}></View>

            }
        }
    }

    return (
        <TouchableOpacity
            style={[styles.rowSpaceBetween, {
                padding: 16,
                backgroundColor: '#FFF',
                width: windowWidth,
                borderBottomWidth: 1,
                borderColor: '#F2F0F5'
            }]}
            onPress={() => {
                let tp = {
                    user: otherUser,
                    lastSeen: info.lastSeen
                }
                props.navigation.navigate("Conversation", { info: tp });
            }}
        >
            <View style={styles.rowAlignItems}>
                <Image
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        borderColor: '#FFA002',
                        borderWidth: otherUser.premium == 'none' ? 0 : 2
                    }}
                    source={{ uri: otherUser.avatar.url }}
                />
                {info.lastSeen == 'onSession' && <View
                    style={{
                        position: 'absolute', width: 12, height: 12, left: 36, top: 36, borderRadius: 6,
                        borderWidth: 2, borderColor: '#FFF', backgroundColor: '#45BF58'
                    }}>
                </View>}
                <View style={{ marginLeft: 16 }}>
                    <SemiBoldText
                        text={otherUser.name}
                        fontSize={15}
                        lineHeight={24}
                    />
                    <View style={styles.rowAlignItems}>
                        <SvgXml
                            width={16}
                            height={16}
                            xml={voiceMessageSvg}
                        />
                        <DescriptionText
                            text={t("voice message")}
                            fontSize={13}
                            lineHeight={21}
                            color='rgba(54, 36, 68, 0.8)'
                        />
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <DescriptionText
                    text={renderTime()}
                    fontSize={13}
                    lineHeight={21}
                    marginBottom={3}
                    color='rgba(54, 36, 68, 0.8)'
                />
                {renderState()}
            </View>
        </TouchableOpacity>
    );
};
