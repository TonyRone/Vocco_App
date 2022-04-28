import React from "react";
import { TitleText } from "./TitleText";
import { View } from "react-native";
import {useTranslation} from 'react-i18next';
import '../../language/i18n';

export const BlockList = ({
  marginTop,
  blockName,
  items
}) => {

  const {t, i18n} = useTranslation();

  return (
    <View style={{marginTop}}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <TitleText
          text={blockName}
          color='#281E30'
          fontSize={15}
        />
        <TitleText
          text={t('Clear')}
          marginRight={16}
          fontSize={15}
          fontFamily="SFProDisplay-Regular"
          color='rgba(38, 52, 73, 0.85)'
          />
      </View>
      <View style={{width:'100%',height:1,backgroundColor:'#F0F4FC',marginTop:9,marginBottom:18}}></View>
      {items.map((item, index) => {
        return (
          <TitleText
            text = {item.title}
            key = {index+'blocklist'}
            fontSize={15}
            fontFamily='SFProDisplay-Regular'
            color='#281E30'
            marginBottom={20}
          />
        )
      })}
    </View>
  );
};
