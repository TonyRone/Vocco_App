import React, {useState} from "react";
import { View, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { SvgXml } from 'react-native-svg';
import { CommenText } from '../component/CommenText';
import { styles } from '../style/Common';

import arrowBendUpLeft from '../../assets/login/arrowbend.svg';

export const PageTitle = ({
  titleContent,
  backCheck = false,
  onPressGoback = () => {},
}) => {

  return (
    <View
      style={[
        { marginTop: 50, paddingHorizontal: 20, marginBottom:20, height:30 }, 
        styles.rowJustifyCenter
      ]}
    >
      {backCheck&&<TouchableOpacity
        onPress={onPressGoback}
        style={{
          position:'absolute',
          left:20
        }}
      >
        <SvgXml 
          width="24" 
          height="24" 
          xml={arrowBendUpLeft} 
        />
      </TouchableOpacity>}
      <CommenText
        text= {titleContent}
        fontSize={20}
        lineHeight={24}
        textAlign='center'
      />
    </View>
  );
};
