import React, {useState} from "react";
import { View, TouchableOpacity, Text, Platform, StatusBar, Pressable,ScrollView } from "react-native";
import { SvgXml } from 'react-native-svg';

import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY, TUTORIAL_CHECK, API_URL, windowWidth, windowHeight } from '../../config/config';

import { TitleText } from '../component/TitleText';
import SwipeDownModal from 'react-native-swipe-down';
import { styles } from '../style/Common';

//Bottom Icons
import homeSvg from '../../assets/common/bottomIcons/home.svg';
import homeActiveSvg from '../../assets/common/bottomIcons/homeActive.svg';
import globalSvg from '../../assets/common/bottomIcons/global.svg';
import globalActiveSvg from '../../assets/common/bottomIcons/globalActive.svg';
import recordSvg from '../../assets/common/bottomIcons/record.svg';
import profileSvg from '../../assets/common/bottomIcons/profile.svg';
import profileActiveSvg from '../../assets/common/bottomIcons/profileActive.svg';
import settingSvg from '../../assets/common/bottomIcons/settings.svg';
import settingsActiveSvg from '../../assets/common/bottomIcons/settingsActive.svg';
import { baseProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlers";

import {useTranslation} from 'react-i18next';
import '../../language/i18n';

export const ReactionEmojies = ({
  onSelectIcon = ()=>{},
  onCloseModal=()=>{},
}) => {

  const {t, i18n} = useTranslation();

  const [showModal,setShowModal] = useState(true);

  // const emojiCodes = [
  //   "😁","😂","😃","😄","😅","😆","😉","😊","😋","😌","😍","😏","😒","😓","😔","😖","😘","😚","😜","😝","😞","😠","😡","😢","😣","😤","😥","😨","😩","😪","😫","😭","😰","😱","😲","😳","😵","😷","😸","😹","😺","😻","😼","😽","😾","😿","🙀","🙅","🙆","🙇","🙈","🙉","🙊","🙋","🙌","🙍","🙎","🙏"
  // ];
  const emojiCodes = [
    "😁","😂","😃","😄","😅","😉","😊","😋","😌","😍","😏","😒","😓","😔","😖","😘","😚","😜","😝","😠","😡","😢","😣","😤","😥","😨","😩","😪","😫","😭","😰","😱","😲","😳","😵","😷","😸","😹","😺","😻","😼","😽","😾","😿","🙀","🙅","🙆","🙇","🙈","🙉","🙊","🙋","🙌","🙍","🙎","🙏"
  ];

  const closeModal = ()=>{
    setShowModal(false);
    onCloseModal();
  }

  const selectIcon = (code)=>{
    setShowModal(false);
    onSelectIcon(code);
  }

  return (
    <SwipeDownModal
      modalVisible={showModal}
      ContentModal={
        <View
          style={{
            borderTopEndRadius:16,
            borderTopLeftRadius:16,
            position:'absolute',
            bottom:0,
            width:'100%',
            backgroundColor: 'white',
            shadowColor:'rgba(42, 10, 111, 1)',
            shadowOffset:{width: 0, height: 2},
            shadowOpacity:0.5,
            shadowRadius:8,
            elevation:10,
            paddingHorizontal:2
          }}
        >
          <View style={{ marginTop: 20,marginBottom:25, width:'100%'}}>
            <TitleText
              text={t("Frequently used")}
              fontFamily="SFProDisplay-Regular"
              fontSize={13}
              lineHeight={16}
              marginBottom={8}
              marginLeft={12}
              color="rgba(59, 31, 82, 0.6)"
            />
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center'}}>
              {emojiCodes.map((code, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectIcon(code)}
                    key = {index+'reactionEmojie'}
                  >
                    <Text
                      style={{
                        fontSize: (windowWidth-20)/9,
                        color: 'white',
                      }}
                    >
                      {code}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      }
      ContentModalStyle={styles.swipeModal}
      onRequestClose={() => closeModal()}
      onClose={() => 
          closeModal()
      }
    />
  );
};
