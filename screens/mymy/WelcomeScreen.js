import React, { useEffect } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';

import { styles } from '../style/Welcome';

const WelcomeScreen = (props) => {

    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.WelcomeContainer}>
                <ImageBackground
                    source={require('../../assets/welcome/Background.png')}
                    resizeMode="stretch"
                    style={styles.background}
                >
                    <View style={styles.rowJustifyCenter}>
                        <Image
                            source={require('../../assets/welcome/logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <View style={{ position: 'absolute', bottom: 20, width: '100%' }}>
                        <View
                            style={styles.rowJustifyCenter}
                        >
                            <TitleText
                                text={t("Raise your voice")}
                                marginTop={20}
                            />
                        </View>
                        <DescriptionText
                            text={t("Discover stories from the world")}
                            textAlign="center"
                            marginTop={20}
                        />
                        <View style={[styles.rowSpaceEvenly, { marginBottom: 25, marginTop: 50 }]}>
                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => props.navigation.navigate("PhoneRegister")}
                            >
                                <Text style={styles.registerText} >{t("Get Started")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => props.navigation.navigate('PhoneLogin')}
                                //onPress={() => props.navigation.navigate('Login')}
                            >
                                <Text style={styles.loginText}>{t("Log In")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
};

export default WelcomeScreen;