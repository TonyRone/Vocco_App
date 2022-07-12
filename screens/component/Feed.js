import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Platform,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const mounted = useRef(false);

  const { t, i18n } = useTranslation();

  const scrollRef = useRef();

  const onRefresh = () => {
    setRefreshing(true);
    setLoadKey(loadKey - 1);
    setTimeout(() => {
      if (mounted.current)
        setRefreshing(false)
    }, 1000);
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  useEffect(() => {
    mounted.current = true;
    return ()=>{
      mounted.current = false;
    }
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
