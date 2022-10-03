import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';

import { SvgXml } from 'react-native-svg';
import RNFetchBlob from 'rn-fetch-blob';
import ShareIconsSvg from '../../assets/post/ShareIcons.svg';
import ShareHintSvg from '../../assets/post/ShareHint.svg';
import shareSvg from '../../assets/post/share.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { TitleText } from './TitleText';
import { DescriptionText } from './DescriptionText';
import { SemiBoldText } from './SemiBoldText';
import { useTranslation } from 'react-i18next';
import closeCircleSvg from '../../assets/post/gray-close.svg';
import '../../language/i18n';
import { MyButton } from './MyButton';

export const ShareHint = ({
  postInfo,
  onShareAudio = ()=>{},
  onCloseModal = () => { }
}) => {

  const { t, i18n } = useTranslation();

  const mounted = useRef(false);

  const [showModal, setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = async (v = false) => {
    setIsLoading(false);
    setShowModal(false);
    onCloseModal();
  }

  const shareAudio = () => {
    const dirs = RNFetchBlob.fs.dirs.DocumentDir;
    const fileName = 'Vocco app - ' + postInfo.title;
    const path = Platform.select({
      ios: `${dirs}/${fileName}.m4a`,
      android: `${dirs}/${fileName}.mp3`,
    });
    setIsLoading(true);
    RNFetchBlob.config({
      fileCache: true,
      path,
    }).fetch('GET', postInfo.file.url).then(res => {
      if (mounted.current && res.respInfo.status == 200) {
        let filePath = res.path();
        onShareAudio(filePath);
        setShowModal(false);
      }
    })
      .catch(async err => {
        console.log(err);
      })
  };

  useEffect(()=>{
    mounted.current = true;
    return ()=>{
      mounted.current = false;
    }
  })

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
        <View style={{
          position: 'absolute',
          backgroundColor: '#FFF',
          bottom: 0,
          width: windowWidth,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          alignItems: 'center'
        }}>
          <TouchableOpacity style={{
            width: windowWidth,
            alignItems: 'flex-end',
            marginTop: 7,
            paddingRight: 12
          }}
            onPress={closeModal}
          >
            <SvgXml
              xml={closeCircleSvg}
            />
          </TouchableOpacity>
          <TitleText
            text={t("Your story is published!")}
            color='#361252'
            fontSize={25.7}
            lineHeight={30}
          />
          <DescriptionText
            text={t("Share your new story with your friends and let the whole world hear you!")}
            color='rgba(54, 18, 82, 0.8)'
            fontSize={15}
            lineHeight={24}
            maxWidth={264}
            textAlign='center'
            marginTop={9}
          />
          <SvgXml
            style={{
              marginTop: 12
            }}
            xml={shareSvg}
          />
          <View
            style={{
              paddingHorizontal: 16,
              width: '100%',
              marginBottom: 16
            }}
          >
            <MyButton
              label={t("Share it now")}
              onPress={shareAudio}
              loading={isLoading}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
