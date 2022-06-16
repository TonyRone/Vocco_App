import React, { useState, useCallback } from 'react';
import {
  View,
  Pressable,
  TouchableOpacity
} from 'react-native';
import { TitleText } from './TitleText';
import { VoiceItem } from './VoiceItem';
import SwipeDownModal from 'react-native-swipe-down';
import Share from 'react-native-share';
import { setRefreshState } from '../../store/actions';

import { SvgXml } from 'react-native-svg';
//Context Icons
import blankHeartSvg from '../../assets/post/blankHeart.svg';
import replySvg from '../../assets/chat/reply.svg';
import forwardSvg from '../../assets/chat/forward.svg';
import saveSvg from '../../assets/chat/save.svg';
import trashSvg from '../../assets/chat/trash.svg';
import selectSvg from '../../assets/chat/select.svg';
import redHeartSvg from '../../assets/post/redHeart.svg';
import ciShareSvg from '../../assets/discover/context/share.svg';
import ciMicrophoneSvg from '../../assets/discover/context/microphone.svg';
import ciUsertSvg from '../../assets/discover/context/user.svg';
import ciReportRedSvg from '../../assets/discover/context/report.svg';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../style/Common';

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { MessageItem } from './MessageItem';

export const MessageContext = ({
  info,
  props,
  onDeleteItem=()=>{},
  onSelectItem=()=>{},
  onReplyMsg = () => { },
  onCloseModal = () => { },
}) => {

  const { t, i18n } = useTranslation();

  const [showModal, setShowModal] = useState(true);

  let { user, refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const dispatch = useDispatch();

  const closeModal = () => {
    setShowModal(false);
    onCloseModal();
  }

  return (
    <SwipeDownModal
      modalVisible={showModal}
      ContentModal={
        <View
          style={{ marginTop: "25%" , paddingHorizontal:8}}
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
              onPress={() => {onReplyMsg();closeModal();}}
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
              onPress={()=>onDeleteItem()}
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
              onPress={() => {onSelectItem();closeModal();}}
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
      }
      ContentModalStyle={styles.swipeModal}
      onRequestClose={() => closeModal()}
      onClose={() =>
        closeModal()
      }
    />
  );
};
