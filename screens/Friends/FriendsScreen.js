import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    SafeAreaView,
    Image
} from 'react-native';

import { DescriptionText } from '../component/DescriptionText';
import { SvgXml } from 'react-native-svg';
import { BottomButtons } from '../component/BottomButtons';
import searchSvg from '../../assets/login/search.svg';
import greenCheckSvg from '../../assets/friend/green-check.svg';
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
import { TitleText } from '../component/TitleText';

const FriendsScreen = (props) => {

    const { t, i18n } = useTranslation();

    let { user, refreshState, socketInstance } = useSelector((state) => {
        return (
            state.user
        )
    });

    const [requests, setRequests] = useState([]);
    const [allRequests, setAllRequests] = useState(false);
    const [suggests, setSuggests] = useState([]);
    const [moreSuggests, setMoreSuggests] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [isFollowers, setIsFollowers] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [invites, setInvites] = useState([]);

    const scrollRef = useRef();
    const scrollIndicator = useRef(new Animated.Value(0)).current;

    const scrollIndicatorPosition = Animated.multiply(
        scrollIndicator,
        142 / windowWidth
    )

    const onAcceptRequest = (id, index) => {
        VoiceService.acceptFriend(id).then(async res => {
            if (res.respInfo.status == 201) {
                setRequests(prev => {
                    prev.splice(index, 1);
                    return [...prev]
                });
            }
            setRefresh(!refresh);
        })
            .catch(err => {
                console.log(err);
            });
    }

    const onDeleteRequest = (index) => {
        VoiceService.deleteNotification(requests[index].id);
        setRequests(prev => {
            prev.splice(index, 1);
            return [...prev]
        });
    }

    const onSendRequest = (index) => {
        VoiceService.followFriend(suggests[index].user.id);
        setSuggests(prev => {
            prev.splice(index, 1);
            return [...prev]
        });
    }

    const onDeleteSuggest = (index) => {
        VoiceService.deleteSuggest(suggests[index].user.id);
        setSuggests(prev => {
            prev.splice(index, 1);
            return [...prev]
        });
    }

    const onDeleteFollower = (index) => {
        VoiceService.deleteFollower(followers[index].user.id);
        setFollowers(prev => {
            prev.splice(index, 1);
            return [...prev]
        });
    }

    const onDeleteFollowing = (index) => {
        VoiceService.deleteFollowing(followings[index].user.id);
        setFollowings(prev => {
            prev.splice(index, 1);
            return [...prev]
        });
    }

    const onInviteFriend = (index) => {
        VoiceService.inviteFriend(contacts[index].user.id);
        setInvites(prev => {
            prev.push(contacts[index].user.id);
            return [...prev]
        });
    }

    const onCompare = (a, b) => {
        if (a.user.name < b.user.name)
            return -1;
        if (a.createdAt > b.createdAt)
            return 1;
        return 0;
    }

    const getUsers = () => {
        let followers = [], followings = [], contacts = [];
        VoiceService.getRequests(0).then(async res => {
            if (res.respInfo.status == 200) {
                const jsonRes = await res.json();
                setRequests(jsonRes);
            }
        })
            .catch(err => {
                console.log(err);
            });
        VoiceService.getSuggests(0).then(async res => {
            if (res.respInfo.status == 200) {
                const jsonRes = await res.json();
                setSuggests(jsonRes);
            }
        })
            .catch(err => {
                console.log(err);
            });
        VoiceService.getFollows(user.id, "Followers").then(async res => {
            if (res.respInfo.status === 200) {
                const jsonRes = await res.json();
                setFollowers(jsonRes);
                console.log(jsonRes[0]);
                const followerIds = new Set(jsonRes.map((item) => item.user.id));
                VoiceService.getFollows(user.id, "Following").then(async res => {
                    if (res.respInfo.status === 200) {
                        const jsonRes1 = await res.json();
                        setFollowings(jsonRes1);
                        contacts = [...jsonRes, ...jsonRes1.filter(x => !followerIds.has(x.user.id))]
                        contacts.sort(onCompare);
                        setContacts(contacts);
                    }
                })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
            .catch(err => {
                console.log(err);
            });
        VoiceService.getInvites().then(async res => {
            if (res.respInfo.status == 200) {
                const jsonRes = await res.json();
                setInvites(jsonRes);
            }
        })
            .catch(err => {
                console.log(err);
            });
    }

    const renderName = (fname, lname) => {
        let fullname = '';
        if (fname)
            fullname = fname;
        if (lname) {
            if (fname) fullname += '.';
            fullname += lname;
        }
        return (fullname == '' ? '' : "@") + fullname
    }

    useEffect(() => {
        getUsers();
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
                    { marginTop: 20, paddingHorizontal: 20, marginBottom: 18 },
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
            <ScrollView
                style={{ marginBottom: Platform.OS == 'ios' ? 65 : 75 }}
            >
                <View style={styles.rowSpaceBetween}>
                    <View style={styles.rowAlignItems}>
                        <SemiBoldText
                            text={t("Requests")}
                            lineHeight={24}
                            fontSize={15}
                            marginLeft={16}
                        />
                        <View style={{
                            borderRadius: 12,
                            backgroundColor: '#F2F0F5',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginLeft: 7
                        }}>
                            <DescriptionText
                                text={requests.length}
                                fontSize={12}
                                lineHeight={16}
                                color="#281E30"
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setAllRequests(!allRequests)}>
                        <DescriptionText
                            text={t(allRequests ? "HIDE" : "SHOW ALL")}
                            fontSize={13}
                            lineHeight={21}
                            marginRight={15}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginLeft: 16,
                    height: 1,
                    width: windowWidth - 16,
                    backgroundColor: "#F0F4FC",
                    marginTop: 9
                }}>
                </View>
                {
                    requests.map((item, index) => {
                        if (!allRequests && index > 1)
                            return null;
                        return <View key={"requests" + index.toString()} style={[styles.rowSpaceBetween, { marginTop: 16 }]}>
                            <View style={styles.rowAlignItems}>
                                <Image
                                    source={{ uri: item.fromUser.avatar.url }}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        marginLeft: 16,
                                    }}
                                />
                                <View style={{
                                    marginLeft: 12
                                }}>
                                    <SemiBoldText
                                        text={item.fromUser.name}
                                        fontSize={15}
                                        lineHeight={24}
                                    />
                                    <DescriptionText
                                        text={renderName(item.fromUser.firstname, item.fromUser.lastname)}
                                        fontSize={13}
                                        lineHeight={21}
                                    />
                                </View>
                            </View>
                            <View style={styles.rowAlignItems}>
                                {!item.friend.status == 'accepted' &&
                                    <TouchableOpacity style={{
                                        backgroundColor: '#F8F0FF',
                                        paddingHorizontal: 16,
                                        paddingVertical: 9,
                                        borderRadius: 8
                                    }}
                                        onPress={() => onAcceptRequest(item.fromUser.id, index)}
                                    >
                                        <SemiBoldText
                                            text={t("Confirm")}
                                            fontSize={13}
                                            lineHeight={21}
                                            color={'#8327D8'}
                                        />
                                    </TouchableOpacity>}
                                <TouchableOpacity style={{
                                    backgroundColor: '#F2F0F5',
                                    paddingHorizontal: 16,
                                    paddingVertical: 9,
                                    borderRadius: 8,
                                    marginHorizontal: 8
                                }}
                                    onPress={() => onDeleteRequest(index)}
                                >
                                    <SemiBoldText
                                        text={t("Delete")}
                                        fontSize={13}
                                        lineHeight={21}
                                        color={'rgba(54, 36, 68, 0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    })
                }
                <View style={[styles.rowSpaceBetween, { marginTop: 24 }]}>
                    <SemiBoldText
                        text={t("Suggest")}
                        lineHeight={24}
                        fontSize={15}
                        marginLeft={16}
                    />
                    <TouchableOpacity onPress={() => setMoreSuggests(!moreSuggests)}>
                        <DescriptionText
                            text={t(moreSuggests ? "SHOW LESS" : "SHOW ALL")}
                            fontSize={13}
                            lineHeight={21}
                            marginRight={15}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginLeft: 16,
                    height: 1,
                    width: windowWidth - 16,
                    backgroundColor: "#F0F4FC",
                    marginTop: 9
                }}>
                </View>
                <ScrollView
                    horizontal
                    style={{
                        marginTop: 9
                    }}
                >
                    {
                        suggests.map((item, index) => {
                            return <View
                                key={"suggests" + index.toString()}
                                style={{
                                    width: 190,
                                    height: 120,
                                    marginLeft: 8,
                                    marginRight: 8,
                                    marginBottom: 6,
                                    borderRadius: 12,
                                    padding: 12,
                                    backgroundColor: '#FFF',
                                    shadowColor: 'rgba(88, 74, 117, 0.5)',
                                    elevation: 10,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 24,
                                }}>
                                <View style={styles.rowAlignItems}>
                                    <Image
                                        source={{ uri: item.user.avatar.url }}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            marginLeft: 16,
                                        }}
                                    />
                                    <View style={{
                                        marginLeft: 12
                                    }}>
                                        <SemiBoldText
                                            text={item.user.name}
                                            fontSize={15}
                                            lineHeight={24}
                                        />
                                        <DescriptionText
                                            text={renderName(item.user.firstname, item.user.lastname)}
                                            fontSize={13}
                                            lineHeight={21}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.rowAlignItems, { marginTop: 9 }]}>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#F8F0FF',
                                        paddingHorizontal: 16,
                                        paddingVertical: 9,
                                        borderRadius: 8
                                    }}
                                        onPress={() => onSendRequest(index)}
                                    >
                                        <SemiBoldText
                                            text={t("Follow")}
                                            fontSize={13}
                                            lineHeight={21}
                                            color={'#8327D8'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#F2F0F5',
                                        paddingHorizontal: 16,
                                        paddingVertical: 9,
                                        borderRadius: 8,
                                        marginHorizontal: 8
                                    }}
                                        onPress={() => onDeleteSuggest(index)}
                                    >
                                        <SemiBoldText
                                            text={t("Remove")}
                                            fontSize={13}
                                            lineHeight={21}
                                            color={'rgba(54, 36, 68, 0.8)'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        })
                    }
                </ScrollView>
                <View style={[styles.rowAlignItems, { marginTop: 16 }]}>
                    <TouchableOpacity onPress={() => { scrollRef.current?.scrollTo({ x: 0, animated: true }); setIsFollowers(true); }} style={[styles.rowAlignItems, { marginLeft: 16, width: 126 }]}>
                        <SemiBoldText
                            text={t("Followers")}
                            fontSize={15}
                            lineHeight={24}
                            marginLeft={8}
                            fontFamily={isFollowers ? 'SFProDisplay-Semibold' : 'SFProDisplay-Regular'}
                        />
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor: '#F2F0F5',
                            marginLeft: 8
                        }}>
                            <DescriptionText
                                text={followers.length}
                                fontSize={12}
                                lineHeight={16}
                                color='#281E30'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { scrollRef.current?.scrollTo({ x: windowWidth, animated: true }); setIsFollowers(false); }} style={[styles.rowAlignItems, { marginLeft: 16, width: 126 }]}>
                        <SemiBoldText
                            text={t("Followings")}
                            fontSize={15}
                            lineHeight={24}
                            marginLeft={8}
                            fontFamily={!isFollowers ? 'SFProDisplay-Semibold' : 'SFProDisplay-Regular'}
                        />
                        <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor: '#F2F0F5',
                            marginLeft: 8
                        }}>
                            <DescriptionText
                                text={followings.length}
                                fontSize={12}
                                lineHeight={16}
                                color='#281E30'
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginLeft: 16,
                    height: 1,
                    width: windowWidth - 16,
                    backgroundColor: "#F0F4FC",
                    marginTop: 9
                }}>
                </View>
                <View style={{ width: 268, marginLeft: 16 }}>
                    <Animated.View style={{
                        width: 126,
                        height: 1,
                        backgroundColor: '#281E30',
                        transform: [{ translateX: scrollIndicatorPosition }]
                    }} />
                </View>
                <ScrollView
                    style={{ maxWidth: windowWidth }}
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
                    <View style={{
                        width: windowWidth
                    }}>
                        {
                            followers.map((item, index) => {
                                return <View key={"followers" + index.toString()} style={[styles.rowSpaceBetween, { marginTop: 16 }]}>
                                    <View style={styles.rowAlignItems}>
                                        <Image
                                            source={{ uri: item.user.avatar.url }}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 24,
                                                marginLeft: 16,
                                            }}
                                        />
                                        <View style={{
                                            marginLeft: 12
                                        }}>
                                            <SemiBoldText
                                                text={item.user.name}
                                                fontSize={15}
                                                lineHeight={24}
                                            />
                                            <DescriptionText
                                                text={renderName(item.user.firstname, item.user.lastname)}
                                                fontSize={13}
                                                lineHeight={21}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#F2F0F5',
                                        paddingHorizontal: 16,
                                        paddingVertical: 9,
                                        borderRadius: 8,
                                        marginRight: 8
                                    }}
                                        onPress={() => onDeleteFollower(index)}
                                    >
                                        <SemiBoldText
                                            text={t("Remove")}
                                            fontSize={13}
                                            lineHeight={21}
                                            color={'rgba(54, 36, 68, 0.8)'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            })
                        }
                    </View>
                    <View style={{
                        width: windowWidth
                    }}>
                        {
                            followings.map((item, index) => {
                                return <View key={"following" + index.toString()} style={[styles.rowSpaceBetween, { marginTop: 16 }]}>
                                    <View style={styles.rowAlignItems}>
                                        <Image
                                            source={{ uri: item.user.avatar.url }}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 24,
                                                marginLeft: 16,
                                            }}
                                        />
                                        <View style={{
                                            marginLeft: 12
                                        }}>
                                            <SemiBoldText
                                                text={item.user.name}
                                                fontSize={15}
                                                lineHeight={24}
                                            />
                                            <DescriptionText
                                                text={renderName(item.user.firstname, item.user.lastname)}
                                                fontSize={13}
                                                lineHeight={21}
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#F2F0F5',
                                        paddingHorizontal: 16,
                                        paddingVertical: 9,
                                        borderRadius: 8,
                                        marginRight: 8
                                    }}
                                        onPress={() => onDeleteFollowing(index)}
                                    >
                                        <SemiBoldText
                                            text={t("Remove")}
                                            fontSize={13}
                                            lineHeight={21}
                                            color={'rgba(54, 36, 68, 0.8)'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            })
                        }
                    </View>
                </ScrollView>
                <SemiBoldText
                    text={t("Invite your contacts")}
                    lineHeight={24}
                    fontSize={15}
                    marginLeft={16}
                    marginTop={24}
                />
                <View style={{
                    marginLeft: 16,
                    height: 1,
                    width: windowWidth - 16,
                    backgroundColor: "#F0F4FC",
                    marginTop: 9
                }}>
                </View>
                {
                    contacts.map((item, index) => {
                        let idx = invites.indexOf(item.user.id);
                        return <View key={"requests" + index.toString()} style={[styles.rowSpaceBetween, { marginTop: 16 }]}>
                            <View style={styles.rowAlignItems}>
                                <Image
                                    source={{ uri: item.user.avatar.url }}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        marginLeft: 16,
                                    }}
                                />
                                <View style={{
                                    marginLeft: 12
                                }}>
                                    <SemiBoldText
                                        text={item.user.name}
                                        fontSize={15}
                                        lineHeight={24}
                                    />
                                    <DescriptionText
                                        text={renderName(item.user.firstname, item.user.lastname)}
                                        fontSize={13}
                                        lineHeight={21}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={{
                                backgroundColor: idx >= 0 ? '#ECF8EE' : '#F2F0F5',
                                paddingHorizontal: 16,
                                paddingVertical: 9,
                                borderRadius: 8,
                                marginRight: 8
                            }}
                                onPress={() => onInviteFriend(index)}
                                disabled={idx>=0}
                            >
                                <View style={styles.rowAlignItems}>
                                    {item.invite && <SvgXml
                                        width={20}
                                        height={20}
                                        style={{
                                            marginRight: 4
                                        }}
                                        xml={greenCheckSvg}
                                    />}
                                    <SemiBoldText
                                        text={t(idx >= 0 ? "Invited" : "Invite")}
                                        fontSize={13}
                                        lineHeight={21}
                                        color={idx >= 0 ? '#1A4C22' : '#8327D8'}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    })
                }
            </ScrollView>
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
