import React, {useState} from "react";
import { View, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { SvgXml } from 'react-native-svg';
import { CommenText } from './CommenText';
import { styles } from '../style/Common';

import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import { DescriptionText } from "./DescriptionText";
import chewronRightSvg from '../../assets/common/chewron_right.svg';
import { TextInput } from "react-native-gesture-handler";

export const SelectForm = ({
  label,
  contentText,
  onPressChange = () => {},
  isCheck = false
}) => {

  return (
    <View style={{marginTop:16}}>
      <DescriptionText
        text={label}
        fontSize={17}
        lineHeight={28}
        color='#281E30'
      />
      <TouchableOpacity onPress={onPressChange} style={[styles.rowSpaceBetween,{marginTop:8, borderRadius:12,borderWidth:1,borderColor:'#F2F0F5',paddingVertical:12,paddingLeft:24,paddingRight:16}]}>
        <DescriptionText
          text={contentText}
          fontSize={17}
          lineHeight={28}
          color='#281E30'
        />
        {isCheck&&
          <SvgXml
            width={24}
            height={24}
            xml={chewronRightSvg}
          />
        }
      </TouchableOpacity>
    </View>
  );
};
