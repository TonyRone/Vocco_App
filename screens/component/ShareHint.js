import React, { useState } from 'react';
import {
  Modal,
  Pressable,
} from 'react-native';

import { SvgXml } from 'react-native-svg';
import ShareIconsSvg from '../../assets/post/ShareIcons.svg';
import ShareHintSvg from '../../assets/post/ShareHint.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POST_CHECK } from '../../config/config';
import { styles } from '../style/Common';

export const ShareHint = ({
  onCloseModal = () => { }
}) => {
  const [showModal, setShowModal] = useState(true);

  const closeModal = async () => {
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
          style={{ position: 'absolute', flex: 1, alignItems: 'flex-end', width: '100%', bottom: 50, paddingHorizontal: 0 }}
          onPress={closeModal}
        >
          <SvgXml
            width={'100%'}
            xml={ShareHintSvg}
          />
          <SvgXml
            width={'50%'}
            style={{
              marginTop: 20
            }}
            xml={ShareIconsSvg}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
