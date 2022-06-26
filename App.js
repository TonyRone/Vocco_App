import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry, Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from 'react-navigation'
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
import HomeScreen from './screens/Home/HomeScreen';
import ChatScreen from './screens/Chat/ChatScreen';
import FriendsScreen from './screens/Friends/FriendsScreen';
import ConversationScreen from './screens/Chat/ConversationScreen';
import PhoneRegisterScreen from './screens/PhoneNumberLogin/PhoneRegisterScreen';
import ProfilePictureScreen from './screens/PhoneNumberLogin/ProfilePictureScreen';
import MainNameScreen from './screens/PhoneNumberLogin/MainNameScreen';
import PhoneVerifyScreen from './screens/PhoneNumberLogin/PhoneVerifyScreen';
import PickNameScreen from './screens/PhoneNumberLogin/PickNameScreen';
import InputBirthdayScreen from './screens/PhoneNumberLogin/InputBirthdayScreen';
import SelectIdentifyScreen from './screens/PhoneNumberLogin/SelectIdentifyScreen';
import PhoneLoginScreen from './screens/PhoneNumberLogin/PhoneLoginScreen';
import UpdatePictureScreen from './screens/PhoneNumberLogin/UpdatePictureScreen';
import SelectTopicScreen from './screens/PhoneNumberLogin/SelectTopicScreen';
import AddFriendScreen from './screens/PhoneNumberLogin/AddFriendScreen';


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
      headerShown: false,
    }
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Verify: {
    screen: VerifyScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Username: {
    screen: UsernameScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Birthday: {
    screen: BirthdayScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Identify: {
    screen: IdentifyScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Country: {
    screen: CountryScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Photo: {
    screen: PhotoScreen,
    navigationOptions: {
      headerShown: false,
    }
  },

  //Tutorial
  Tutorial: {
    screen: TutorialScreen,
    navigationOptions: {
      headerShown: false,
    }
  },

  //Discover
  Discover: {
    screen: DiscoverScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerShown: false,
      cardStyleInterpolator: slideAnimation2
    }
  },

  //Feed
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      headerShown: false,
    }
  },

  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    }
  },

  //Record
  HoldRecord: {
    screen: HoldRecordScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PostingVoice: {
    screen: PostingVoiceScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  UserProfile: {
    screen: UserProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  UserProfileList: {
    screen: UserProfileListScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  VoiceProfile: {
    screen: VoiceProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ChangeEmail: {
    screen: ChangeEmailScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ShareFriend: {
    screen: ShareFriendScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Contact: {
    screen: ContactScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Notification: {
    screen: NotificationScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PostingAnswerVoice: {
    screen: PostingAnswerVoiceScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Share: {
    screen: ShareScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Premium: {
    screen: PremiumScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Friends: {
    screen: FriendsScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Conversation: {
    screen: ConversationScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PhoneRegister: {
    screen: PhoneRegisterScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  ProfilePicture: {
    screen: ProfilePictureScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  MainName: {
    screen: MainNameScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PhoneVerify: {
    screen: PhoneVerifyScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PickName: {
    screen: PickNameScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  InputBirthday: {
    screen: InputBirthdayScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  SelectIdentify: {
    screen: SelectIdentifyScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PhoneLogin: {
    screen: PhoneLoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  UpdatePicture: {
    screen: UpdatePictureScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  SelectTopic: {
    screen: SelectTopicScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  AddFriend: {
    screen: AddFriendScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
},
  {
    //initialRouteName:'AddFriend'
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default App = () => {
  useEffect(() => {
    SplashScreen.hide();
    PushNotification.requestPermissions();
  }, []);
  return (
    <Provider store={store}>
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Provider>
  );
};

// AppRegistry.registerComponent("Vocco", () => App);"Vocco"