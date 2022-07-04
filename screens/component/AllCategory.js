import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Platform
} from 'react-native';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { TitleText } from './TitleText';
import { CategoryIcon } from './CategoryIcon';
import { SvgXml } from 'react-native-svg';
import closeSvg from '../../assets/discover/close.svg'
import { Categories } from '../../config/config';
import { styles } from '../style/Common';

export const AllCategory = ({
  closeModal = () => { },
  setCategory = () => { },
  selectedCategory = ''
}) => {

  const { t, i18n } = useTranslation();

  return (
    <View
      style={{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#FFF',
        marginTop: 20,
        flex: 1
      }}
    >
      <View
        style={[
          {
            marginTop: Platform.OS == 'ios' ? 50 : 20,
            paddingHorizontal: 20,
            marginBottom: 20,
            height: 30,
          },
          styles.rowJustifyCenter
        ]}
      >
        <TitleText
          text={t("All Categories")}
          fontSize={20}
          color="#281E30"
        />
        <TouchableOpacity
          onPress={() => closeModal()}
          style={{
            position: 'absolute',
            right: 20
          }}
        >
          <SvgXml
            width="24"
            height="24"
            xml={closeSvg}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
        {Categories.map((item, index) => {
          return (
            <CategoryIcon
              key={'all_catagory' + index}
              label={item.label}
              source={item.uri}
              onPress={() => setCategory(index)}
              active={selectedCategory == index ? true : false}
            />
          )
        })}
      </View>
    </View>
  );
};
