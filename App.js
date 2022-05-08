import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry, Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import {createAppContainer} from 'react-navigation'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen'
import LoginScreen from './screens/mymy/LoginScreen';
import RegisterScreen from './screens/mymy/RegisterScreen';
import WelcomeScreen from './screens/mymy/WelcomeScreen';
import VerifyScreen from './screens/mymy/VerifyScreen';
import UsernameScreen from './screens/mymy/UsernameScreen';
import BirthdayScreen from './screens/mymy/BirthdayScreen';
import IdentifyScreen from './screens/mymy/IdentifyScreen';
import CountryScreen from './screens/mymy/CountryScreen';
import PhotoScreen from './screens/mymy/PhotoScreen';
import LogoScreen from './screens/mymy/LogoScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import VoiceProfileScreen from './screens/Profile/VoiceProfileScreen';
import ShareScreen from './screens/mymy/ShareScreen';
import PremiumScreen from './screens/mymy/PremiumScreen';

//Setting

import SettingScreen from './screens/Setting/SettingScreen';
import EditProfileScreen from './screens/Setting/EditProfileScreen';
import ChangeEmailScreen from './screens/Setting/ChangeEmailScreen';

//Tutorial
import TutorialScreen from './screens/Tutorial/TutorialScreen';

//Discover
import DiscoverScreen from './screens/Discover/DiscoverScreen';
import SearchScreen from './screens/Discover/SearchScreen';

//Feed
import FeedScreen from './screens/Home/FeedScreen';

//Record
import HoldRecordScreen from './screens/Record/HoldRecordScreen';
import PostingVoiceScreen from './screens/Record/PostingVoiceScreen';

import ChangePasswordScreen from './screens/Setting/ChangePasswordScreen';
import ShareFriendScreen from './screens/Setting/ShareFriendScreen';
import ContactScreen from './screens/Setting/ContactScreen';
import NotificationScreen from './screens/Notification/NotificationScreen';
import UserProfileScreen from './screens/UserProfile/UserProfileScreen';
import UserProfileListScreen from './screens/UserProfile/UserProfileListScreen';

import NavigationService from './services/NavigationService';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import PostingAnswerVoiceScreen from './screens/Record/PostingAnswerVoiceScreen';
import VoicePlayer from './screens/Home/VoicePlayer';


const slideAnimation2 = (bottomToTop) => {
  const multiplier = bottomToTop ? -1 : 1;
  return ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [multiplier * layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  };
};

const store = configureStore()

const AppNavigator = createStackNavigator({
  Logo: {
    screen: LogoScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Verify: {
    screen: VerifyScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Username: {
    screen: UsernameScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Birthday: {
    screen: BirthdayScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Identify: {
    screen: IdentifyScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Country: {
    screen: CountryScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Photo: {
    screen: PhotoScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },

  //Tutorial
  Tutorial: {
    screen: TutorialScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },

  //Discover
  Discover: {
    screen: DiscoverScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      cardStyleInterpolator:slideAnimation2
    }
  },

  //Feed
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
    }
  },

  //Record
  HoldRecord: {
    screen: HoldRecordScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  PostingVoice: {
    screen: PostingVoiceScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  UserProfile: {
    screen: UserProfileScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  UserProfileList: {
    screen: UserProfileListScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  VoiceProfile: {
    screen: VoiceProfileScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  ChangeEmail: {
    screen: ChangeEmailScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  ShareFriend: {
    screen: ShareFriendScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Contact: {
    screen: ContactScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Notification: {
    screen: NotificationScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  PostingAnswerVoice: {
    screen: PostingAnswerVoiceScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Share: {
    screen: ShareScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Premium: {
    screen: PremiumScreen,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
  Test: {
    screen: VoicePlayer,
    navigationOptions: {
      headerShown:false,
      headerStyle:{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }
    }
  },
},
// {
//   initialRouteName:'Logo'
// }
);


const onRemoteNotification = (notification) => {
  const isClicked = notification.getData().userInteraction === 1;

  if (isClicked) {
    NavigationService.navigate(notification.getData().nav,notification.params);
  } else {
    
  }
};

const AppContainer = createAppContainer(AppNavigator);

export default App = () => {
  useEffect(() => {
    SplashScreen.hide();
    PushNotification.requestPermissions();
    //PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    //return ()=>PushNotificationIOS.removeEventListener('notification');
  }, []);
  return (
    <Provider store = { store }>
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Provider>
  );
};

// AppRegistry.registerComponent("Vocco", () => App);