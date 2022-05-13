import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import SwipeDownModal from 'react-native-swipe-down';
import { TitleText } from '../component/TitleText';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import { MyColorButton } from '../component/MyColorButton';
import { MyTextField } from '../component/MyTextField';
import { SelectForm} from '../component/SelectForm';
import { MyIdentify } from '../component/MyIdentify';
import { SearchCountry } from '../component/SearchCountry';
import * as Progress from "react-native-progress";

import { SvgXml } from 'react-native-svg';

import closeBlackSvg from '../../assets/record/closeBlack.svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import yesSwitchSvg from '../../assets/common/yesSwitch.svg';
import noSwitchSvg from '../../assets/common/noSwitch.svg';
import editSvg from '../../assets/record/edit.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';

import manSvg from '../../assets/login/man.svg';
import womanSvg from '../../assets/login/woman.svg';
import moreSvg from '../../assets/login/more.svg';
import privacySvg from '../../assets/setting/privacy.svg';

import {  windowHeight, windowWidth } from '../../config/config';

import { styles } from '../style/Common';
import { CommenText } from '../component/CommenText';
import EditService from '../../services/EditService';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/actions';

import {useTranslation} from 'react-i18next';
import '../../language/i18n';

const EditProfileScreen = (props) => {

    const {t, i18n} = useTranslation();

    const user = useSelector((state)=>state.user.user);
    const dispatch = useDispatch();
    let userData = {...user};

    const [username, setUsername] = useState(userData.name);
    const [firstname, setFirstname] = useState(userData.firstname);
    const [lastname, setLastname] = useState(userData.lastname);
    const [birthdate,setBirthdate] = useState(new Date(userData.dob));
    const [showModal,setShowModal] = useState(false);
    const [gender,setGender] = useState(userData.gender);
    const [userCountry,setUserCountry] = useState({country:userData.country});
    const [validUsername, setValidUsername] = useState(true);
    const [inputState, setInputState] = useState({});
    const [privated,setPrivateStatus] = useState(userData.isPrivate);
    const [date, setDate] = useState(birthdate);
    const [identify,setIdentify] = useState(userData.gender);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [modalType,setModaltype] = useState('');
    const [country, setCountry] = useState({country:userData.country});
    const [password,setPassword] = useState('');
    const [useremail,setUseremail] = useState(userData.email);
    const [loading,setLoading] = useState(false);
    const [allLoading,setAllLoading] = useState(false);
    const [warningState,setWarningState] = useState(false);
    const [bio, setBio] = useState(userData.bio);

    const passwordRef = useRef();

    const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    const showEye = () => {
        setSecureTextEntry(!secureTextEntry); 
    }

    const setUserbirth = (birthday) =>{
        setShowModal(false);
        setBirthdate(birthday);
    }

    const deleteAccount = () =>{
        setShowModal(false);
    }

    const setUserGender = (gd)=>{
        setShowModal(false);
        setGender(gd);
    }

    const selectCountry = (cur)=>{
        setShowModal(false);
        setUserCountry(cur);    
    }

    const openModal = (type)=>{
        setModaltype(type);
        setShowModal(true);
    }

    const confirmUserName = ()=>{
        if(validUsername==false){
            setInputState({username:'Username is not available'})
            setWarningState(true);
        }
        else{
            setAllLoading(true);
            EditService.userNameVerify(username).then(async res=>{
                if(res.respInfo.status==201){
                    setInputState({username:t("Username is available")});
                    handleSubmit();
                }
                else{
                    setWarningState(true);
                    setInputState({username:t("This username is already taken")})
                }
                setAllLoading(false);
            })
            .catch(err=>{

            })
        }
    }

    const checkUsername = (newVal) => {
        setUsername(newVal);
        setWarningState(false);
        setInputState({});
        let reg = /^[A-Za-z0-9]+(?:[.-_-][A-Za-z0-9]+)*$/;
        if (reg.test(newVal) === true) {
            setValidUsername(true);
        } else {
            setValidUsername(false);
        }
    }

    const handleSubmit = async()=>{
        const payload = {
            bio:bio,
            name: username,
            dob: birthdate,
            country:userCountry.country,
            gender:gender,
            first:firstname,
            last:lastname,
            isPrivate:privated?'true':'false'
        };
        EditService.changeProfile(payload).then(async res => { 
            try {
                const jsonRes = await res.json();

                if (res.respInfo.status != 200) {
                    // setIsError(true);
                    // setMessage(jsonRes.message);
                } else {
                    dispatch(setUser(jsonRes));
                    props.navigation.navigate('Setting');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });  
    }

    useEffect(() => {
      //  checkLogin();
    }, [])
    return (
      <KeyboardAvoidingView 
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
                    xml={arrowBendUpLeft}
                />
            </TouchableOpacity>
            <TitleText
                text={t("Edit profile")}
                fontSize={20}
                lineHeight={24}
            />
            <TouchableOpacity style ={{position:'absolute',right:16}} onPress={()=>confirmUserName()}>
                <DescriptionText
                    text={t('Save')}
                    fontSize={17}
                    lineHeight={28}
                    color='#8327D8'
                />
            </TouchableOpacity>
        </View>
        <ScrollView>
            <View style={{alignItems:'center',marginTop:18}}>
                <TouchableOpacity onLongPress={()=>props.navigation.navigate('Photo',{imageUrl:userData.avatar.url,backPage:'Setting'})}>
                    <Image
                        style={{
                            width:122,
                            height:122,
                            borderRadius:61,
                        }}
                        source={{uri:userData.avatar.url}}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={[styles.contentCenter,{position:'absolute',bottom:0,left:windowWidth/2+29, width:32,height:32,borderRadius:16,backgroundColor:'#8327D8'}]}>
                        <SvgXml
                            height={100}
                            white={100}
                            xml={editSvg}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.rowSpaceBetween,{marginTop:30, paddingHorizontal:16,paddingVertical:16,borderBottomColor:'#F2F0F5',borderBottomWidth:1}]}>
                <View style={styles.rowAlignItems}>
                    <View style={[styles.contentCenter,{height:40,width:40,borderRadius:16,backgroundColor:'#F8F0FF'}]}>
                        <SvgXml
                            height={24}
                            white={24}
                            xml={privacySvg}
                        />  
                    </View>
                    <DescriptionText
                        text={t("Private account")}
                        fontSize={17}
                        lineHeight={28}
                        color ='black'
                        marginLeft={16}
                    />
                </View>
                <TouchableOpacity onPress={()=>setPrivateStatus(!privated)}>
                    <SvgXml
                        width={51}
                        height={31}
                        xml={privated?yesSwitchSvg:noSwitchSvg}
                    />
                </TouchableOpacity>
            </View>
            <View style={{marginHorizontal:16}}>
                <MyTextField
                    label={t("Your bio")}
                    placeholderText=""
                    color='#281E30'
                    value={bio}
                    onChangeText={(newVal) => newVal.length<=150?setBio(newVal):null}
                    marginTop={16}
                    numberOfLines={3}
                    multiline={true}
                    check={false}
                />
                <MyTextField
                    label={t("First Name")}
                    placeholderText="John e.g"
                    color='#281E30'
                    value={firstname}
                    onChangeText={(newVal) => setFirstname(newVal)}
                    marginTop={16}
                    check={false}
                />
                <MyTextField
                    label={t("Last Name")}
                    placeholderText="John e.g"
                    value={lastname}
                    color='#281E30'
                    onChangeText={(newVal) => setLastname(newVal)}
                    marginTop={16}
                    check={false}
                />
                <MyTextField
                    label={t("Username")}
                    placeholderText="John e.g"
                    value={username}
                    color='#281E30'
                    onChangeText={(newVal) => {checkUsername(newVal);}}
                    stateText={inputState.username}
                    marginTop={16}
                    warning = { warningState }
                    check={validUsername}
                />
                <SelectForm
                    label={t("Date of Birth")}
                    contentText={birthdate.getDate().toString()+" "+months[birthdate.getMonth()]+" "+birthdate.getFullYear().toString()}
                    onPressChange={()=>openModal('birth')}
                />
                <SelectForm
                    label={t("Your gender")}
                    contentText={gender=='m'?t("man"):gender=='f'?t("woman"):t("other")}
                    onPressChange={()=>openModal('gender')}
                    isCheck = {true}
                />
                <SelectForm
                    label={t("Your email")}
                    contentText={useremail}
                    onPressChange={()=>props.navigation.navigate('ChangeEmail')}
                    isCheck = {true}
                />
                <SelectForm
                    label={t("Your country")}
                    contentText={userCountry.country}
                    onPressChange={()=>openModal('country')}
                    isCheck = {true}
                />
            </View>
            <TouchableOpacity onPress={()=>openModal('deleteAccount')} style={{paddingHorizontal:16, marginTop:32,marginBottom:20, flexDirection:'row',alignItems:'center',width:windowWidth,height:72,borderTopWidth:1,borderTopColor:'#F2F0F5'}}>
                <View style={[styles.contentCenter,{width:40,height:40,borderRadius:12,borderColor:'#FFE8E8'}]}>
                    <SvgXml
                        width={24}
                        height={24}
                        xml ={redTrashSvg}
                    />
                </View>
                <DescriptionText
                    text={t("Delete my account")}
                    fontSize={17}
                    lineHeight={28}
                    color='black'
                    marginLeft={16}
                />
            </TouchableOpacity>
        </ScrollView>
        <SwipeDownModal
            modalVisible={showModal}
            ContentModal={
                <>
                    {modalType=='birth'&&<View style={styles.swipeContainerContent}>
                        <View style={[styles.rowSpaceBetween,{paddingHorizontal:14,paddingVertical:12}]}>
                            <TouchableOpacity onPress={()=>setShowModal(false)}>
                                <DescriptionText
                                    text={t('Cancel')}
                                    fontSize={17}
                                    lineHeight={28}
                                    color='#1E61EB'
                                />
                            </TouchableOpacity>
                            <CommenText
                                text={t('Date of Birth')}
                                fontSize={17}
                                lineHeight={28}
                                color='#263449'
                            />
                            <TouchableOpacity onPress={()=>setUserbirth(date)}>
                                <DescriptionText
                                    text={t("Select")}
                                    fontSize={17}
                                    lineHeight={28}
                                    color='#1E61EB'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.rowJustifyCenter,{marginBottom:20}]}>
                            <DatePicker 
                                date={date} 
                                onDateChange={(newDate)=>setDate(newDate)} 
                                mode="date"
                                androidVariant='iosClone'
                            />
                        </View>
                    </View>
                    }
                    {modalType=='gender'&&<View style={styles.swipeInputContainerContent}>
                        <View style={[styles.rowSpaceBetween,{paddingHorizontal:14,paddingVertical:12}]}>
                        <TouchableOpacity onPress={()=>setShowModal(false)}>
                            <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                                <SvgXml
                                    width={18}
                                    height={18}
                                    xml={closeBlackSvg}
                                    />
                            </View>
                        </TouchableOpacity>
                        <CommenText
                            text={t('Your gender')}
                            fontSize={17}
                            lineHeight={28}
                            color='#263449'
                        />
                        <TouchableOpacity onPress={()=>setUserGender(identify)}>
                            <DescriptionText
                                text={t('Save')}
                                fontSize={17}
                                lineHeight={28}
                                color='#8327D8'
                            />
                        </TouchableOpacity>
                        </View>
                        <TitleText
                            text={t("How do you identify?")}
                            fontSize={22}
                            lineHeight={28}
                            textAlign='center'
                            marginTop={45}
                        />
                        <View 
                            style={{
                                marginTop:35, 
                                paddingHorizontal:16,
                            }}
                        >
                            <MyIdentify 
                                label={t("Woman")}
                                active={identify == "f" ? true : false}
                                genderSvg={womanSvg}
                                onPress={() => setIdentify('f')}
                            />
                            <MyIdentify 
                                label={t("Man")}
                                active={identify == "m" ? true : false}
                                marginTop={16}
                                genderSvg={manSvg}
                                onPress={() => setIdentify('m')}
                            />
                            <MyIdentify 
                                label={t("Other")}
                                active={identify == "other" ? true : false}
                                marginTop={16}
                                genderSvg={moreSvg}
                                onPress={() => setIdentify('other')}
                            />
                        </View>
                        <View style={{position:'absolute', bottom:0, width:'100%', paddingHorizontal:16}}>
                            <MyButton
                                label={t("Save")}
                                onPress={()=>setUserGender(identify)}
                                active={identify ? true : false}
                                marginTop={windowHeight-540}
                                loading={loading}
                                marginBottom={25}
                            />        
                        </View>
                    </View>}
                    {modalType=='country'&&<View style={styles.swipeInputContainerContent}>
                        <View style={[styles.rowSpaceBetween,{paddingHorizontal:14,paddingVertical:12}]}>
                            <TouchableOpacity onPress={()=>setShowModal(false)}>
                                <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                                    <SvgXml
                                        width={18}
                                        height={18}
                                        xml={closeBlackSvg}
                                        />
                                </View>
                            </TouchableOpacity>
                            <CommenText
                                text={t("Select your country")}
                                fontSize={17}
                                lineHeight={28}
                                color='#263449'
                            />
                            <TouchableOpacity onPress={()=>selectCountry(country)}>
                                <DescriptionText
                                    text={t('Save')}
                                    fontSize={17}
                                    lineHeight={28}
                                    color='#8327D8'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingHorizontal:16,marginTop:16}}>
                            <SearchCountry
                                height = {windowHeight-190}
                                onSelectCountry={(cty)=>setCountry(cty)}
                            />
                        </View>
                        <LinearGradient
                            colors={['#FFFFFF', 'rgba(255,255,255, 0)']}
                            locations={[0.7,1]}
                            start={{x: 0, y: 1}} end={{x: 0, y: 0}}
                            style={{position:'absolute',paddingHorizontal:16, bottom:0,width:windowWidth}}
                        >
                        <MyButton
                            label={t("Save")}
                            onPress={()=>selectCountry(country)}
                            active={country ? true : false}
                            marginBottom={25}
                        />
                        </LinearGradient>
                    </View>}
                    {modalType=='deleteAccount'&&<View style={styles.swipeInputContainerContent}>
                        <View style={[styles.rowSpaceBetween,{paddingHorizontal:14,paddingVertical:12}]}>
                            <TouchableOpacity  onPress={()=>setShowModal(false)}>
                                <View style={[styles.contentCenter,{width:28,height:28,borderRadius:14,backgroundColor:'#F0F4FC'}]}>
                                    <SvgXml
                                        width={18}
                                        height={18}
                                        xml={closeBlackSvg}
                                        />
                                </View>
                            </TouchableOpacity>
                            <CommenText
                                text={t("Delete account")}
                                fontSize={17}
                                lineHeight={28}
                                color='#263449'
                            />
                            <TouchableOpacity disabled={!password} onPress={()=>deleteAccount()}>
                                <DescriptionText
                                    text={t('Delete')}
                                    fontSize={17}
                                    lineHeight={28}
                                    color='#E41717'
                                />
                            </TouchableOpacity>
                        </View>
                        {/* <TitleText
                            text = {t("Confirm delete")}
                            fontSize = {22}
                            lineHeight = {28}
                            textAlign = 'center'
                            marginTop = {40}
                        /> */}
                        <DescriptionText
                            text = {t("Enter your password for confirm deleting your account")}
                            fontSize = {17}
                            lineHeight = {28}
                            color = 'rgba(54, 36, 68, 0.8)'
                            textAlign = 'center'
                            marginTop = {25}
                            marginLeft = {18}
                            marginRight = {16}
                        />
                        <View style={{paddingHorizontal:16, marginTop:25}}>
                            <MyTextField
                                label={t("Enter your password")}
                                refer={passwordRef}
                                secureTextEntry={secureTextEntry}
                                color='#281E30'
                                placeholderText=""
                                value={password}
                                onChangeText={(newVal) => setPassword(newVal)}
                                errorText={inputState.password}
                                showEye={()=>showEye()}
                                isPassword={true}
                            />
                        </View>
                        <View style={{position:'absolute',paddingHorizontal:16, bottom:0,width:windowWidth}}>
                            <MyColorButton
                                label={t("Delete account")}
                                marginBottom={20}
                                onPress={()=>deleteAccount()}
                                color = '#E41717'
                                shadowColor = 'rgba(244, 13, 13, 0.47)'
                                active={password ? true : false}
                            />
                        </View>
                    </View>
                    }
                </>
            }
            ContentModalStyle={styles.swipeModal}
            onRequestClose={() => {setShowModal(false)}}
            onClose={() => {
                setShowModal(false);
            }}
        />
        {allLoading&&<View style={{position:'absolute',zIndex:10, width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <Progress.Circle
            indeterminate
            size={30}
            color="white"
            style={{ alignSelf: "center" }}
          />
        </View>}
      </KeyboardAvoidingView>
    );
  };
  
  export default EditProfileScreen;