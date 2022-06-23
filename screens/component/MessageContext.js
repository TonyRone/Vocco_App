import React, { useState } from 'react';
import {
  View,
  Pressable,
  TouchableOpacity,
  Modal
} from 'react-native';
import { TitleText } from './TitleText';
import { SvgXml } from 'react-native-svg';
import replySvg from '../../assets/chat/reply.svg';
import forwardSvg from '../../assets/chat/forward.svg';
import saveSvg from '../../assets/chat/save.svg';
import trashSvg from '../../assets/chat/trash.svg';
import selectSvg from '../../assets/chat/select.svg';
import { styles } from '../style/Common';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { MessageItem } from './MessageItem';

export const MessageContext = ({
  info,
  props,
  onDeleteItem = () => { },
  onSelectItem = () => { },
  onReplyMsg = () => { },
  onCloseModal = () => { },
}) => {

  const { t, i18n } = useTranslation();

  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
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
        <View
          style={{ marginTop: "25%", paddingHorizontal: 8 }}
        >
          <MessageItem
            props={props}
            info={info}
          />
          <View
            style={{
              width: "65%",
              marginTop: 20,
              borderRadius: 16,
              backgroundColor: '#FFF'
            }}
          >
            <TouchableOpacity
              style={styles.contextMenu}
              onPress={() => { onReplyMsg(); closeModal(); }}
            >
              <TitleText
                text={t("Reply")}
                fontSize={17}
                fontFamily="SFProDisplay-Regular"
              />
              <SvgXml
                width={20}
                height={20}
                xml={replySvg}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contextMenu}
            >
              <TitleText
                text={t("Forward")}
                fontSize={17}
                fontFamily="SFProDisplay-Regular"
              />
              <SvgXml
                width={20}
                height={20}
                xml={forwardSvg}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contextMenu}
            >
              <TitleText
                text={t("Save as")}
                fontSize={17}
                fontFamily="SFProDisplay-Regular"
              />
              <SvgXml
                width={20}
                height={20}
                xml={saveSvg}
              />
            </TouchableOpacity>
            <Pressable
              onPress={() => onDeleteItem()}
              style={[styles.contextMenu, { borderBottomWidth: 8 }]}
            >
              <TitleText
                text={t("Delete")}
                fontSize={17}
                color='#E41717'
                fontFamily="SFProDisplay-Regular"
              />
              <SvgXml
                width={20}
                height={20}
                xml={trashSvg}
              />
            </Pressable>
            <TouchableOpacity
              onPress={() => { onSelectItem(); closeModal(); }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TitleText
                text={t("Select")}
                fontSize={17}
                fontFamily="SFProDisplay-Regular"
              />
              <SvgXml
                width={20}
                height={20}
                xml={selectSvg}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
