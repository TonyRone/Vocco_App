import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { t } from 'i18next';
import { windowWidth } from '../../config/config';
import whitePostSvg from '../../assets/record/white_post.svg';
import colorPostSvg from '../../assets/record/color_post.svg';

export const ChatComposer = (props) => {
  const { text, onChangeText, onFocus, onSend } = props;
  const [newContentSize, setNewContentSize] = useState();
  const [finalInputHeight, setFinalInputHeight] = useState(28);

  const calcInputHeight = (contentSize) => {
    if (contentSize?.height) {
      if (!text?.length && finalInputHeight) {
        setFinalInputHeight(0);
        return;
      }
      setFinalInputHeight(contentSize.height);
    }
  }

  const onContentSizeChange = (e) => {
    const { contentSize } = e.nativeEvent;
    if (!contentSize) {
      return;
    }
    if (
      !newContentSize ||
      (newContentSize && newContentSize.height !== contentSize.height)
    ) {
      setNewContentSize(contentSize);
      if (!text?.length) {
        setFinalInputHeight(0);
      } else {
        calcInputHeight(contentSize);
      }
    }
  }

  return (
    <View
      style={[
        styles.composer,
        { height: finalInputHeight },
      ]}
    >
      <TextInput
        autoCapitalize="none"
        multiline={true}
        value={text}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onContentSizeChange={onContentSizeChange}
        placeholder={t("Send your message")}
        placeholderTextColor="rgba(59, 31, 82, 0.6)"
        style={styles.textInput}
      />
      <TouchableOpacity
        disabled={text.length === 0}
        onPress={onSend}
      >
        <SvgXml
          xml={text ? colorPostSvg : whitePostSvg}
          style={styles.sendButton}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 39,
    maxHeight: 92,
    backgroundColor: '#F2F0F5',
    borderRadius: 40,
    paddingHorizontal: 16,
    marginLeft: 10,
    marginRight: 65,
  },
  textInput: {
    width: windowWidth * 10 / 19,
    fontSize: 15,
    lineHeight: 18,
    color: '#281E30',
  },
  sendButton: {
    marginBottom: 6,
  },
});
