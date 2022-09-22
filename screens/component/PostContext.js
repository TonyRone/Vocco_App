import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { TitleText } from './TitleText';
import { VoiceItem } from './VoiceItem';
import { SvgXml } from 'react-native-svg';
import ciUsertSvg from '../../assets/discover/context/user.svg';
import ciReportRedSvg from '../../assets/discover/context/report.svg';
import ciAbuseSvg from '../../assets/discover/context/abuse.svg';
import ciReportSvg from '../../assets/discover/context/report.svg';
import ciFakeSvg from '../../assets/discover/context/fake.svg';
import ciBackSvg from '../../assets/discover/context/back.svg';
import ciTrashSvg from '../../assets/discover/context/trash.svg';
import ciViolenceSvg from '../../assets/discover/context/violence.svg';
import VoiceService from '../../services/VoiceService';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from '../style/Common';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { setRefreshState } from '../../store/actions';

export const PostContext = ({
  postInfo,
  props,
  onChangeIsLike = () => { },
  onCloseModal = () => { },
}) => {

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [showReport, setShowReport] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [playstatus, setPlaystatus] = useState(false);
  const [loading, setLoading] = useState(false);

  let { refreshState } = useSelector((state) => {
    return (
      state.user
    )
  });

  const mounted = useRef(false);

  const appreciateVoice = () => {
    onChangeIsLike();
    if (postInfo.isLike == false)
      VoiceService.recordAppreciate({ count: 1, id: postInfo.id });
    else
      VoiceService.recordUnAppreciate(postInfo.id);
  }

  const closeModal = () => {
    setShowModal(false);
    onCloseModal();
  }

  const onBlockUser = () => {
    VoiceService.blockUser(postInfo.user.id).then(res => {
      dispatch(setRefreshState(!refreshState));
      closeModal();
    })
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  }, [])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      elevation={5}
      visible={showModal}
      onRequestClose={() => {
        closeModal();
      }}
    >
      <Pressable onPressOut={closeModal} style={styles.swipeModal}>
        <View
          style={{ marginTop: "25%" }}
        >
          <VoiceItem
            info={postInfo}
            isPlaying={playstatus}
            onPressPlay={() => setPlaystatus(!playstatus)}
            onStopPlay={() => setPlaystatus(false)}
            spread={false}
          />
          {!showReport ?
            <View
              style={styles.contextWrap}
            >
              {/* <TouchableOpacity
                style={styles.contextMenu}
                onPress={() => { props.navigation.navigate('VoiceProfile', { id: postInfo.id }); closeModal(); }}
              >
                <TitleText
                  text={t("Answer")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciMicrophoneSvg}
                />
              </TouchableOpacity>
               <TouchableOpacity
                style={styles.contextMenu}
                onPress={onShareAudio}
              >
                <TitleText
                  text={t("Share")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <Image
                  source={require('../../assets/record/Share.png')}
                  style={{ width: 75, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contextMenu}
                onPress={() => appreciateVoice()}
              >
                <TitleText
                  text={t("Appreciate")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={postInfo.isLike ? redHeartSvg : blankHeartSvg}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.contextMenu}
                onPress={() => {
                  onBlockUser();
                }}
              >
                <TitleText
                  text={"Block"}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                  color="#E41717"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciUsertSvg}
                />
              </TouchableOpacity>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
                onPress={() => setShowReport(true)}
              >
                <TitleText
                  text={t("Report")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciReportRedSvg}
                />
              </Pressable>
            </View>
            :
            <View
              style={styles.contextWrap}
            >
              <Pressable
                style={styles.contextMenu}
              >
                <TitleText
                  text={t("Spam")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciTrashSvg}
                />
              </Pressable>
              <Pressable
                style={styles.contextMenu}
              >
                <TitleText
                  text={t("Fake Account")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciFakeSvg}
                />
              </Pressable>
              <Pressable
                style={styles.contextMenu}
              >
                <TitleText
                  text={t("Violence")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciViolenceSvg}
                />
              </Pressable>
              <Pressable
                style={styles.contextMenu}
              >
                <TitleText
                  text={t("Child Abuse")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciAbuseSvg}
                />
              </Pressable>
              <Pressable
                style={styles.contextMenu}
              >
                <TitleText
                  text={t("Other")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciReportSvg}
                />
              </Pressable>
              <View
                style={{
                  height: 8,
                  backgroundColor: 'rgba(3, 0, 39, 0.15)'
                }}
              ></View>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
                onPress={() => setShowReport(false)}
              >
                <TitleText
                  text={t("Back")}
                  fontSize={17}
                  fontFamily="SFProDisplay-Regular"
                />
                <SvgXml
                  width={20}
                  height={20}
                  xml={ciBackSvg}
                />
              </Pressable>
            </View>
          }
        </View>
      </Pressable>
    </Modal>
  );
};
