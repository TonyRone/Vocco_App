import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableHighlight, 
  Image, 
  Pressable, 
  ScrollView,
  Platform, StatusBar,
  ImageBackground
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import SwipeDownModal from 'react-native-swipe-down';
import { LinearTextGradient } from "react-native-text-gradient";
import { TitleText } from '../component/TitleText';
import { Warning } from '../component/Warning';
import { BlockList } from '../component/BlockList';
import { CategoryIcon } from '../component/CategoryIcon';
import { DescriptionText } from '../component/DescriptionText';
import { MyButton } from '../component/MyButton';
import { MyProgressBar } from '../component/MyProgressBar';
import { MyTextField } from '../component/MyTextField';
import { VoiceItem } from '../component/VoiceItem';
import { BottomButtons } from '../component/BottomButtons';
import Tooltip from 'react-native-walkthrough-tooltip';

import recordSvg from '../../assets/common/bottomIcons/record.svg';
import { SvgXml } from 'react-native-svg';
import arrowBendUpLeft from '../../assets/login/arrowbend.svg';
import closeBlackSvg from '../../assets/record/closeBlack.svg';
import pauseSvg from '../../assets/common/pause.svg';
import moreSvg from '../../assets/common/more.svg';
import playSvg from '../../assets/common/play.svg';
import yesSwitchSvg from '../../assets/common/yesSwitch.svg';
import noSwitchSvg from '../../assets/common/noSwitch.svg';
import replaySvg from '../../assets/common/replay.svg';
import editSvg from '../../assets/common/edit.svg';
import publicSvg from '../../assets/record/public.svg';
import erngSvg from '../../assets/common/erng.svg';

import boxbackArrowSvg from '../../assets/profile/box_backarrow.svg';
import followSvg from '../../assets/profile/follow.svg';
import unfollowSvg from '../../assets/profile/unfollow.svg';
import blockSvg from '../../assets/profile/block.svg';
import redTrashSvg from '../../assets/common/red_trash.svg';

import shareSvg from '../../assets/post/share.svg';

import heartSvg from '../../assets/common/icons/heart.svg';
import smileSvg from '../../assets/common/icons/smile.svg';
import shineSvg from '../../assets/common/icons/shine.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, windowHeight, windowWidth } from '../../config/config';
import { styles } from '../style/Common';
import { FlatList } from 'react-native-gesture-handler';
import { BottomSheet } from 'react-native-elements/dist/bottomSheet/BottomSheet';
import { isTemplateElement } from '@babel/types';
import { CommenText } from '../component/CommenText';

const UserProfileListScreen = (props) => {

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [error, setError] = useState({});
    const [toolTipVisible, setToolTipVisible] = useState(true);
    const [showTip, setTip] = useState(true);
    const [onSearch,setOnSearch] = useState(false);
    const [visibleStatus,setVisibleStatus] = useState(false);
    const [visibleReaction,setVisibleReaction] = useState(false);
    const [label,setLabel] = useState('');
    const [playStatus,setPlayStatus] = useState(false);
    const [recentItems, setRecentItems] = useState(['medicine','bugs','design','First game']);
    const inputRef = useRef(null);
    const [emoticanReactions,setEmoticanReactions] = useState([{v:"1"}]);
    
    const replay = () =>{

    }

    const handleSubmit = ()=>{

    }

    useEffect(() => {
      //  checkLogin();
    }, [])
    return (
      <KeyboardAvoidingView 
        style={{
          backgroundColor:'#FFF',
          flex:1
        }}
      >
        <View style={styles.titleContainer}>
            <TouchableOpacity  onPress={()=>props.navigation.goBack()}>
                <SvgXml
                    width={24}
                    height={24}
                    xml={arrowBendUpLeft}
                />
            </TouchableOpacity>
            <CommenText
                text='@deny_prank'
                fontSize={20}
                lineHeight={24}
            />
            <View style={styles.rowAlignItems}>
              <TouchableOpacity>
                <SvgXml
                  width={24}
                  height={24}
                  xml={followSvg}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft:16}}>
                <SvgXml
                  width={24}
                  height={24}
                  xml={moreSvg}
                />
              </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default UserProfileListScreen;