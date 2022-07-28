import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

import { SvgXml } from 'react-native-svg';
import ShareIconsSvg from '../../assets/post/ShareIcons.svg';
import ShareHintSvg from '../../assets/post/ShareHint.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { TitleText } from './TitleText';
import { DescriptionText } from './DescriptionText';
import { SemiBoldText } from './SemiBoldText';
import { useTranslation } from 'react-i18next';
import closeCircleSvg from '../../assets/common/close-circle.svg';
import '../../language/i18n';

export const ShareHint = ({
  onCloseModal = () => { }
}) => {

  const { t, i18n } = useTranslation();

  const [showModal, setShowModal] = useState(true);

  const closeModal = async (v = false) => {
    await AsyncStorage.setItem(
      POST_CHECK,
      "checked"
    );
    setShowModal(false);
    onCloseModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        closeModal();
      }}
    >
      <Pressable onPressOut={closeModal} style={styles.swipeModal}>
        <Pressable
          style={{ position: 'absolute', alignItems: 'flex-end', width: '100%', bottom: 50, paddingHorizontal: 0 }}
          onPress={closeModal}
        >
          <View style={{
            width: windowWidth - 48,
            marginRight: 24,
            borderRadius: 16,
            padding: 24,
            backgroundColor: '#FFF'
          }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 14,
                right: 14
              }}
              onPress={closeModal}
            >
              <SvgXml
                width={24}
                height={24}
                xml={closeCircleSvg}
              />
            </TouchableOpacity>
            <Image
              source={require("../../assets/post/Logos.png")}
              style={{
                marginTop: -16
              }}
            />
            <TitleText
              text={t("Share with friends!")}
              fontSize={22}
              lineHeight={28}
              marginTop={16}
            />
            <DescriptionText
              text={t("Share the stories to your friends and make them know about Vocco!")}
              fontSize={15}
              lineHeight={24}
              marginTop={11}
              color='#281E30'
            />
            <SemiBoldText
              text={t("Thanks for sharing!")}
              fontSize={15}
              lineHeight={24}
              marginTop={24}
              color='#281E30'
            />
            <View style={{
              alignItems: 'flex-end'
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F8F0FF',
                  height: 60,
                  borderRadius: 16,
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  marginTop: 24
                }}
                onPress={()=>closeModal(true)}
              >
                <Text
                  style={
                    {
                      color: '#8327D8',
                      fontFamily: "SFProDisplay-Semibold",
                      fontSize: 17
                    }
                  }
                >
                  {t("Let's share!")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image
            source={require("../../assets/post/triangle.png")}
            style={{
              marginRight: 80,
            }}
          />
          <SvgXml
            //width={'50%'}
            style={{
              marginTop: 60,
              marginRight: 35
            }}
            xml={ShareIconsSvg}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
