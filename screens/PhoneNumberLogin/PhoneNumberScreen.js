import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, Platform } from 'react-native';
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

const PhoneNumberScreen = (props) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");

    const { t, i18n } = useTranslation();
    const phoneInput = useRef();

    useEffect(() => {
    }, [])

    return (
        <ImageBackground
            source={require('../../assets/phoneNumber/background.png')}
            resizeMode="stretch"
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
                    progress={1}
                />
                <View>
                </View>
            </View>
            <TitleText
                text={t("What's your number?")}
                textAlign='center'
            />
            <DescriptionText
                text={t("We'll text a code to verify your phone")}
                fontSize={15}
                lineHeight={24}
                textAlign='center'
                marginTop={8}
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 45
            }}>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="FR"
                    //layout="second"
                    placeholder="Phone Number"
                    containerStyle={{
                        borderRadius: 8,
                        height: 60,
                        width: windowWidth - 40,
                    }}
                    textContainerStyle={{
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        height: 60,
                    }}
                    textInputStyle={{
                        fontSize: 24,
                        height: 60,
                        lineHeight: 24,
                        textAlignVertical: 'center',
                        color: '#281E30'
                    }}
                    codeTextStyle={{
                        fontSize: 24,
                        lineHeight: 24,
                        height: 60,
                        textAlignVertical: 'center',
                        color: '#281E30'
                    }}
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    autoFocus
                />
            </View>
            <TouchableOpacity style={{
                position: 'absolute',
                right: 16,
                bottom: 16,
            }}
                onPress={()=>{}}
                disabled={!phoneInput.current?.isValidNumber(value)}
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
                    colors={phoneInput.current?.isValidNumber(value) ? ['#D89DF4', '#B35CF8', '#8229F4'] : ['#FBF2FF', '#F7E5FF', '#E5D1FF']}
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

export default PhoneNumberScreen;