import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  ScrollView,
  ImageBackground
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { styles } from '../style/Common';
import { Avatars, Months, windowHeight, windowWidth } from '../../config/config';
import { LinearTextGradient } from 'react-native-text-gradient';
import VoiceService from '../../services/VoiceService';

export const FullCalendar = ({
  props,
  selectedMonth,
  onSelectDay = () => { },
  onCloseModal = () => { }
}) => {

  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        closeModal();
      }}
    >
      <Pressable style={[styles.swipeModal, { justifyContent: 'center', alignItems: 'center' }]} onPress={closeModal}>
        <View style={{
          width: windowWidth - 24,
          backgroundColor: '#FFF',
          borderRadius: 20,
          alignItems: 'center',
        }}>
          <LinearTextGradient
            style={{ marginTop: 15, marginBottom: 5 }}
            locations={[0, 1]}
            colors={["#D79AF5", "#8E35F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <DescriptionText
              text={Months[selectedMonth - 1]}
              fontSize={21}
              lineHeight={24}
            />
          </LinearTextGradient>
          
          
        </View>
      </Pressable>
    </Modal>
  );
};
