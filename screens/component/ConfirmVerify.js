import React, { useState, useEffect} from 'react';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {useTranslation} from 'react-i18next';
import '../../language/i18n';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import AuthService from '../../services/AuthService';
import EditService from '../../services/EditService';
import { styles } from '../style/Login';
import { useSelector } from 'react-redux';

export const ConfirmVerify = ({
    marginTop = 0,
    onSuccess =()=>{},
    isChanging = false
}) => {

  const [pseudo, setPseudo] = useState("");
  const [loading,setLoading] = useState(false);

  const {t, i18n} = useTranslation();

  const user = useSelector((state)=>state.user.user);

  const checkLogin = async () => {
  }

  const handleSubmit = async ({}) => {
    const payload = {
       pseudo:pseudo,
    };
    let rqst;
    setLoading(true);
    if(isChanging)
      rqst = EditService.confirmVerify(pseudo);
    else
      rqst = AuthService.confirmVerify(payload);
    rqst.then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.respInfo.status !== 201) {
                setPseudo('');
              //  setMessage(jsonRes.message);
            } else {
                onSuccess();
             //   setMessage(jsonRes.message);
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

  return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        {/* <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>  */}
        <View
          style={{ marginTop: marginTop, paddingHorizontal: 20 }}
        >
          <DescriptionText
            text={t("We sent a code to ")+user.email+"."}
          // text="sdfsdf"
            fontSize={15}
            //marginTop={10}
            textAlign="center"
          />
          <DescriptionText
            text={t("Enter it here to verify your identity")}
            fontSize={15}
            textAlign="center"
          />
        </View>
        <TouchableOpacity onPress={()=>AuthService.ResendCode()}>
          <Text
            style={{
              textAlign:'center',
              color:'#8327D8',
              fontSize:15,
              marginTop:15
            }}
          >
            {t("Resend code")}
          </Text>
        </TouchableOpacity>
        <View
          style={
            {
              marginTop: 50,
              padding: 16,
              flexDirection:'row',
              justifyContent:'center'
            }
          }
        >
          <OTPInputView
              style={{width: '80%', height: 100}}
              pinCount={6}
              code = {pseudo}
              // code={''} 1//You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged = {code => { setPseudo(code) }}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled = {(code) => {
                  setPseudo(code)
              }}
          />
        </View>
        <View 
          style={{
            paddingHorizontal:16,
            position:'absolute',
            width:'100%',
            bottom:30
          }}
        >
          <MyButton
            label={t("Confirm")}
            onPress={handleSubmit}
            active={pseudo.length == 6 ? true : false}
            loading = {loading}
          />
        </View>
      </KeyboardAvoidingView>
  );
};
