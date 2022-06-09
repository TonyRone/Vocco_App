import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Image,
  Pressable,
  ScrollView
} from "react-native";

import {useTranslation} from 'react-i18next';
import '../../language/i18n'
import { DescriptionText } from "./DescriptionText";

import { SvgXml } from 'react-native-svg';
import redTrashSvg from '../../assets/common/red_trash.svg';
import yellow_starSvg from '../../assets/common/yellow_star.svg';

import whiteTrashSvg from '../../assets/notification/white_trash.svg'

import { styles } from '../style/Common';
import { SemiBoldText } from "./CommenText";
import { windowWidth } from "../../config/config";
import { produceWithPatches } from 'immer';

export const NotificationItem = ({
  userImage,
  userName,
  userPremium = false,
  details,
  isNew = false,
  notificationTime,
  isActivity = false,
  accepted = false,
  onPressItem = ()=>{},
  onAcceptUser = ()=>{},
  onDeleteItem = ()=>{}
}) => {

    const {t, i18n} = useTranslation();

    const [isDeleted,setIsDeleted] = useState(false);
    let num = Math.ceil((new Date().getTime()-new Date(notificationTime).getTime())/60000);
    let flag = num;
    let minute = num%60;
    num = (num-minute)/60;
    let hour = num%24;
    let day = (num-hour)/24
    let time = (day>0?(day.toString()+' '+t("day")+(day>1?'s':'')):(hour>0?(hour.toString()+' '+t("hour")+(hour>1?'s':'')):(minute>0?(minute.toString()+' '+t("minute")+(minute>1?'s':'')):'')));
    if(details == 'friendAccept')
        details = t("Followed you");
    if(details == 'friendDelete')
        details = t("Stopped following");
    if(details == 'likeRecord')
        details = t("Liked your story");
    if(details == 'newAnswer')
        details = t("Answered your story");
    if(details == 'likeAnswer')
        details = t("Liked your answer");
    

    return (
    !isDeleted?
    <ScrollView  horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{maxWidth:windowWidth,borderBottomColor:'#F2F0F5',borderBottomWidth:1}}>
        <TouchableOpacity
            style={[styles.rowSpaceBetween,{
                padding:16,
                backgroundColor:'#FFF',
                width:windowWidth
            }]}
            onPress={()=>{
                onPressItem();
            }}
        >
        <View style={styles.rowAlignItems}>     
            <Image
                style={{
                    width:40,
                    height:40,
                    borderRadius:12,
                    borderColor:'#FFA002',
                    borderWidth:userPremium=='none'?0:2
                }}
                source={{uri:userImage}}
            />
            {isNew&&isActivity&&<View
                style={{
                    position:'absolute',width:12,height:12,left:30,top:34,borderRadius:6,
                    borderWidth:2,borderColor:'#FFF',backgroundColor:'#D82783'}}>
            </View>}
            <View style={{marginLeft:16}}>
                <View style={styles.rowAlignItems}>
                    {userPremium!='none'&&
                        <SvgXml
                            width={30}
                            height={30}
                            xml={yellow_starSvg}
                        />
                    }
                    <SemiBoldText
                        text = {userName}
                        fontSize = {15}
                        lineHeight = {24}  
                    />
                </View>
                <DescriptionText
                    text = {details}
                    fontSize = {13}
                    lineHeight = {21}
                    color = 'rgba(54, 36, 68, 0.8)'
                    marginTop = {2}
            />
            </View>
        </View>
        {(!isActivity)?
        <View style = {styles.rowAlignItems}>
            <TouchableOpacity onPress={()=>{onDeleteItem();setIsDeleted(true);}} style={[styles.contentCenter,{width:40,height:40,borderRadius:12,backgroundColor:'#FFE8E8'}]}>
                <SvgXml
                    width={24}
                    height={24}
                    xml ={redTrashSvg}
                />
            </TouchableOpacity>
            {!accepted&&<TouchableOpacity onPress={()=>onAcceptUser()} style={[styles.contentCenter,{width:99,height:40,borderRadius:12,backgroundColor:'#F8F0FF',marginLeft:8}]}>      
                <SemiBoldText
                    text='Accept'
                    fontSize = {15}
                    lineHeight = {24}
                    color = '#8327D8'
                />
            </TouchableOpacity>}
        </View>
        :<DescriptionText
            text = {time}
            fontSize = {13}
            lineHeight = {21}
            color = 'rgba(54, 36, 68, 0.8)'
            marginBottom = {20}
        />} 
        </TouchableOpacity>
        {isActivity&&
        <TouchableOpacity onPress={()=>{onDeleteItem();setIsDeleted(true);}} style={[styles.rowAlignItems,{
            width:windowWidth,
            paddingVertical:24,
            backgroundColor:'#E41717',
            borderTopLeftRadius:24,
            borderBottomLeftRadius:24
        }]}>
            <View style={{width:2,height:16,marginLeft:4,backgroundColor:'#B91313',borderRadius:1}}></View>
            <SvgXml
                marginLeft = {10}
                xml={whiteTrashSvg}
            />
            <DescriptionText
                text = {t("Delete")}
                fontSize = {17}
                lineHeight = {22}
                color = 'white'
                marginLeft= {16}
            />
        </TouchableOpacity>}
    </ScrollView>
    :null
  );
};
