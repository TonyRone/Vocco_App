import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
} from 'react-native';

import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import { MyTextField } from '../component/MyTextField';
import { ConfirmVerify } from '../component/ConfirmVerify';
import { SvgXml } from 'react-native-svg';

import closeBlackSvg from '../../assets/record/closeBlack.svg';
import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import EditService from '../../services/EditService';
import * as bcrypt from 'bcryptjs';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/actions';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangeEmailScreen = (props) => {

    const {t, i18n} = useTranslation();

    const user = useSelector((state)=>state.user.user);
    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading,setLoading] = useState(false);
    const [statetype,setStatetype] =useState('password');

    const showEye = () => {
        setSecureTextEntry(!secureTextEntry); 
    }

    const handleSubmit = async ()=>{
        setError({});
        if(statetype=='password'){
            if (password == '') {
                setError({ password: t("required field") });
                return;
            }
          
            if (password.length < 3) { //8
                setError({
                  password: t("at least 3 characters"),
                });
                return;
            }
            setLoading(true);
            const valid = await bcrypt.compare(password, user.password);
            if(valid)
                setStatetype('email');
            else
                setError({password:t('Wrong Password')})
            setLoading(false);
        }
        if(statetype=='email'){
            if (email == '') {
                setError({
                    email: t("required field"),
                });
                return;
            }
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(email) === false) {
                setError({ email: t("invalid email address") })
                return;
            }
            const payload = {
                password,
                newemail:email
              };
            setLoading(true);
            EditService.changeEmail(payload).then(async res => {
                try {
                    const jsonRes = await res.json();
                    if(res.respInfo.status ==201){                
                    setStatetype('verify');
                    }
                } catch (err) {
                    console.log(err);
                };
                setLoading(false);
            })
            .catch(err => {
            console.log(err);
            });
        }     
    }

    const successProcess = () =>{
        let userData = {...user};
        userData.email = email;
        dispatch(setUser(userData));
        props.navigation.navigate('Setting');
    }

    useEffect(() => {
      //  checkLogin();
    }, [])
    return (
      <SafeAreaView 
        style={{
          backgroundColor:'#FFF',
          flex:1,
        }}
      >
        <View style={styles.titleContainer}>
            <TouchableOpacity style ={{position:'absolute',left:16}} onPress={()=>props.navigation.goBack()}>
                <SvgXml
                    width={24}
                    height={24}
                    xml={closeBlackSvg}
                />
            </TouchableOpacity>
            <CommenText
                text={t("Change email")}
                fontSize={20}
                lineHeight={24}
            />
            <TouchableOpacity style ={{position:'absolute',right:16}} disabled={!password} onPress={()=>deleteAccount()}>
                <DescriptionText
                    text={statetype=='verify'?t('Confirm'):t('Next')}
                    fontSize={17}
                    lineHeight={28}
                    color={password?'#8327D8':'#CC9BF9'}
                />
            </TouchableOpacity>
        </View>
        {statetype!='verify'?<>
            <TitleText
                text = {statetype=='password'?t('Confirm change'):t('Your new email')}
                fontSize = {22}
                lineHeight = {28}
                textAlign = 'center'
                marginTop = {29}
            />
            <View style={{paddingHorizontal:16,marginTop:34}}>
                {statetype=='password'?<MyTextField
                    label={t("Enter your password")}
                    refer={passwordRef}
                    secureTextEntry = {secureTextEntry}
                    color='#281E30'
                    placeholderText=""
                    value={password}
                    onChangeText={(newVal) => setPassword(newVal)}
                    errorText={error.password}
                    showEye={()=>showEye()}
                    isPassword={true}
                />:
                <MyTextField
                    label={t("Enter your new email")}
                    keyboardType="email-address"
                    refer={emailRef}
                    color='#281E30'
                    placeholderText="email@example.com"
                    value={email}
                    onChangeText={(newVal) => setEmail(newVal)}
                    errorText={error.email}
                />}
            </View>
            <View style={styles.bottomContainer}>
                <MyButton
                    label ={t('Next')}
                    active = {password?true:false}
                    loading = {loading}
                    onPress = {()=>handleSubmit()}
                />
            </View></>:<>
            <TitleText
                text = {t("Verify it's you")}
                fontSize = {22}
                lineHeight = {28}
                textAlign = 'center'
                marginTop = {33}
            />
            <ConfirmVerify
                onSuccess ={()=>successProcess()}
                isChanging = {true}
            /></>
        }
      </SafeAreaView>
    );
  };
  
  export default ChangeEmailScreen;