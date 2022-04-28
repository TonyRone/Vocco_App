import React, { useEffect} from 'react';
import { View, KeyboardAvoidingView, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

import { styles } from '../style/Welcome';

const WelcomeScreen = (props) => {

    const {t, i18n} = useTranslation();

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
                 
                    <View style={{position:'absolute' , bottom:20, width:'100%'}}>
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
                        <View style={[styles.rowSpaceEvenly, {marginBottom:25, marginTop:50}]}>
                            <TouchableOpacity 
                                style={styles.registerButton}
                                onPress={() => props.navigation.navigate("Register")}
                            >
                                {/* <LinearTextGradient
                                    style={{ fontWeight: "bold", fontSize: 17 }}
                                    locations={[0, 1, 2]}
                                    colors={["#CF68FF", "#A24EE4", "#4C32EC"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                > */}
                                <Text style={styles.registerText} >{t("Register")}</Text>
                                {/* </LinearTextGradient> */}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.loginButton}
                                onPress={()=>props.navigation.navigate('Login')}
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