import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEVICE_TOKEN, DEVICE_OS } from './config';
import NavigationService from '../services/NavigationService';

PushNotification.configure({
  onRegister: async ({token, os}) => {
    await AsyncStorage.setItem(
      DEVICE_TOKEN,
      token
    );
    await AsyncStorage.setItem(
      DEVICE_OS,
      os
    );
  },

  onNotification: (notification) => {
    setTimeout(() => {
      NavigationService.navigate(notification.data.nav,notification.data.params);
    }, 1000);
    //notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

});