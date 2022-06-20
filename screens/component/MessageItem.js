import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import replySvg from '../../assets/chat/reply-icon.svg';
import selectedSvg from '../../assets/chat/selected.svg';
import unSelectedSvg from '../../assets/chat/unselected.svg';
import { styles } from '../style/Common';
import { windowWidth } from "../../config/config";

import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { MessageContext } from "./MessageContext";
import { MessageContent } from "./MessageContent";

export const MessageItem = ({
  props,
  info,
  isSelect = -1,
  ancestorInfo = null,
  onDeleteItem = () => { },
  onSelectItem = () => { },
  onReplyMsg = () => { }
}) => {

  const { user } = useSelector((state) => state.user);

  const [showContext, setShowContext] = useState(false);

  const { t, i18n } = useTranslation();

  const isSender = (user.id == info.user.id);

  return (
    <>
      <View style={[styles.rowAlignItems, { width: windowWidth }]}>
        {isSelect >= 0 &&
          <SvgXml
            width={24}
            height={24}
            style={{
              marginRight: 16
            }}
            xml={isSelect > 0 ? selectedSvg : unSelectedSvg}
          />
        }
        <Pressable onPress={() => isSelect >= 0 ? onSelectItem() : null} onLongPress={() => isSelect == -1 ? setShowContext(true) : null} style={{
          flexDirection: 'row',
          width: windowWidth - (isSelect >= 0 ? 56 : 16),
          justifyContent: isSender ? 'flex-end' : 'flex-start', marginTop: 8
        }}>
          {ancestorInfo ?
            <View style={styles.rowAlignItems}>
              <View style={{
                width: 2,
                height: '90%',
                backgroundColor: '#A851F8',
                marginRight: 12,
              }}>
              </View>
              <View>
                <MessageContent
                  info={ancestorInfo}
                />
                <View style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <MessageContent
                    info={info}
                    isAnswer={true}
                  />
                  <SvgXml
                    width={23}
                    height={23}
                    style={{ marginLeft: 9 }}
                    xml={replySvg}
                  />
                </View>
              </View>
            </View>
            :
            <MessageContent
              info={info}
            />
          }
        </Pressable>
      </View>
      {showContext &&
        <MessageContext
          props={props}
          info={info}
          onDeleteItem={() => onDeleteItem()}
          onSelectItem={() => onSelectItem()}
          onReplyMsg={() => onReplyMsg()}
          onCloseModal={() => setShowContext(false)}
        />
      }
    </>
  );
};
