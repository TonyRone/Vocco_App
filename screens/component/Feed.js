import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';


import { FeedStories } from './FeedStories';
import { useTranslation } from 'react-i18next';
import '../../language/i18n';
import { windowWidth } from '../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import { TemporaryStories } from './TemporaryStories';
import { setUser } from '../../store/actions';
import { DiscoverStories } from './Discoverstories';

export const Feed = ({
  props,
  onSetExpandKey = () => { }
}) => {

  const [loadKey, setLoadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const mounted = useRef(false);

  const { t, i18n } = useTranslation();

  const scrollRef = useRef();

  let { user } = useSelector((state) => {
    return (
      state.user
    )
  });

  const dispatch = useDispatch();

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
    let tp = user;
    tp.lastSee = new Date();
    dispatch(setUser(tp));
    return () => {
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
      {/* <ScrollView
        style={{ marginBottom: Platform.OS == 'ios' ? 65 : 75, marginTop: 10, flex:1 }}
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
      > */}
      <DiscoverStories
        props={props}
        loadKey={loadKey}
        screenName="Feed"
      />
      {/* </ScrollView> */}
    </View>
  );
};
