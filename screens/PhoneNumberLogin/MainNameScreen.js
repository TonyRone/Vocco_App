import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import { SvgXml } from 'react-native-svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import rightArrowSvg from '../../assets/phoneNumber/right-arrow.svg';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import '../../language/i18n';

import { styles } from '../style/Welcome';
import { MyProgressBar } from '../component/MyProgressBar';
import { windowWidth } from '../../config/config';
import { TextInput } from 'react-native-gesture-handler';

const MainNameScreen = (props) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");

    const { t, i18n } = useTranslation();
    const phoneInput = useRef();

    useEffect(() => {
    }, [])

    return (
        <ImageBackground
            source={require('../../assets/phoneNumber/background.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <View
                style={[
                    { marginTop: Platform.OS == 'ios' ? 50 : 20, paddingHorizontal: 12, marginBottom: 47, height: 30 },
                    styles.rowSpaceBetween
                ]}
            >
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                >
                    <SvgXml
                        width="24"
                        height="24"
                        xml={arrowBendUpLeft}
                    />
                </TouchableOpacity>
                <MyProgressBar
                    progress={0}
                />
                <View>
                </View>
            </View>
            <TitleText
                text={t("Hi! What's your name?")}
                textAlign='center'
            />
            <DescriptionText
                text={t("This name will show in the chat")}
                fontSize={15}
                lineHeight={24}
                textAlign='center'
                marginTop={8}
            />
            <View style={{
                width:windowWidth,
                alignItems:'center',
                marginTop: 53
            }}>
                <View style={{
                    // paddingVertical: 14,
                    borderRadius: 8,
                    paddingHorizontal: 24,
                    borderWidth: 3,
                    borderColor: '#FFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <TextInput
                        style={
                            {
                                fontSize: 28,
                                lineHeight: 34,
                                color: '#281E30',
                                width: windowWidth - 60
                            }
                        }
                        textAlign='center'
                        maxWidth={250}
                        value={value}
                        autoCapitalize='words'
                        onChangeText={e => setValue(e)}
                    />
                </View>
            </View>
            <TouchableOpacity style={{
                position: 'absolute',
                right: 16,
                bottom: 16,
            }}
                onPress={() => props.navigation.navigate('PhoneRegister')}
                disabled={value.length<3}
            >
                <LinearGradient
                    style={
                        {
                            height: 56,
                            width: 56,
                            borderRadius: 28,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }
                    }
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={value.length > 2 ? ['#D89DF4', '#B35CF8', '#8229F4'] : ['#FBF2FF', '#F7E5FF', '#E5D1FF']}
                >
                    <SvgXml
                        width={32}
                        height={32}
                        xml={rightArrowSvg}
                    />
                </LinearGradient>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default MainNameScreen;