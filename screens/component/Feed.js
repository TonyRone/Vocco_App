import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Platform,
} from 'react-native';

import { Stories } from './Stories';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { windowWidth } from '../../config/config';
import { useDispatch } from 'react-redux';
import { TemporaryStories } from './TemporaryStories';

export const Feed = ({
  props,
  onSetExpandKey = () => { }
}) => {

  const [loadKey, setLoadKey] = useState(0);

  const { t, i18n } = useTranslation();

  const scrollRef = useRef();

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  useEffect(() => {

  }, [])

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        width: windowWidth,
        flex: 1,
      }}
    >
      <TemporaryStories
        props={props}
        onSetExpandKey={() => onSetExpandKey()}
      />
      <ScrollView
        style={{ marginBottom: Platform.OS == 'ios' ? 65 : 75, marginTop: 10 }}
        ref={scrollRef}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setLoadKey(loadKey + 1);
          }
        }}
        scrollEventThrottle={400}
      >
        <Stories
          props={props}
          loadKey={loadKey}
          screenName="Feed"
        />
      </ScrollView>
    </View>
  );
};
