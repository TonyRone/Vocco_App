import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import CheckBox from 'react-native-check-box';

import { styles } from '../style/Welcome';

const WelcomeScreen = (props) => {

    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [])

    const [isSelected, setIsSelected] = useState(false);
    const [isWarning, setIsWarning] = useState(false);

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
                                text={t("Worldwide stories")}
                                marginTop={20}
                            />
                        </View>
                        <DescriptionText
                            text={t("Everyday")}
                            textAlign="center"
                            marginTop={15}
                        />
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 15 }}>
                            <CheckBox
                                isChecked={isSelected}
                                onClick={() => {setIsSelected(!isSelected); setIsWarning(false)}}
                                // style={{ width: 12, height: 12 }}
                            />
                            <Text style={{ color: "#000000", fontSize: 13, lineHeight: 13, marginLeft: 3 }}>{t("I accept the")}</Text>
                            <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => Linking.openURL("https://vocco.ai/privacy")}>
                                <Text style={{ color: "#A24EE4", fontSize: 13, lineHeight: 13 }}>{t("terms of use and privacy policy")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.rowSpaceEvenly, { marginBottom: 25, marginTop: 50 }]}>
                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => { isSelected ? props.navigation.navigate("MainName") : setIsWarning(true)}}
                            >
                                <Text style={styles.registerText} >{t("Get Started")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => { isSelected ? props.navigation.navigate('PhoneLogin') : setIsWarning(true)}}
                                //onPress={() => props.navigation.navigate('Login')}
                            >
                                <Text style={styles.loginText}>{t("Log In")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            { isWarning && <View style={{ position: "absolute", width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", top: 30 }}>
                <View style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: "#E41717",
                borderRadius: 16,
                shadowColor: 'rgba(244, 13, 13, 0.47)',
                elevation: 10,
                shadowOffset: { width: 0, height: 5.22 },
                shadowOpacity: 0.5,
                shadowRadius: 16
            }}>
                <Text style={{ color: "white", fontSize: 15, lineHeight: 18 }}>{t("You must agree our terms")}</Text>
            </View>
            </View> }
        </View>
    );
};

export default WelcomeScreen;