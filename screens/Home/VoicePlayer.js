import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../style/Common';
import { recorderPlayer } from './AudioRecorderPlayer';
import { DescriptionText } from '../component/DescriptionText';
import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import RNFetchBlob from 'rn-fetch-blob';
import { setVoiceState } from '../../store/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { windowWidth } from '../../config/config';
import pauseSvg from '../../assets/common/pause.svg';
import playSvg from '../../assets/common/play.svg';
import replaySvg from '../../assets/common/replay.svg';

const screenWidth = Dimensions.get('screen').width;

class VoicePlayer extends Component {

  dirs = RNFetchBlob.fs.dirs;
  path = Platform.select({
    ios: 'hello.m4a',
    android: `${this.dirs.CacheDir}/hello.mp3`,
  });

  _isMounted = false;
  _playerPath = this.path;
  waveHeight = 40;
  waveheights = [7, 12, 2, 1, 8, 3, 13, 9, 12, 10, 31, 24, 29, 8, 32, 38, 18, 19, 28, 7, 19, 13, 17, 10, 14, 1, 28, 10, 31, 2, 30, 3, 3, 23, 30, 3, 39, 35, 21, 38, 32, 5, 12, 19, 13, 13, 10, 10, 33, 18, 37, 33, 9, 32, 30, 13, 8, 24, 18, 4, 21, 9, 16, 8, 18, 20, 28, 16, 23, 11, 16, 15, 11, 29, 4, 35, 37, 23, 15, 28]
  constructor(props) {
    super(props);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this.changePlayStatus = this.changePlayStatus.bind(this);
    this.onReplay = this.onReplay.bind(this);
    this.getPlayLink = this.getPlayLink.bind(this);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: props.duration,
      playTime: '00:00:00',
      duration: '00:00:00',
      isPlaying: false,
      isStarted: false,
      voiceKey: props.voiceState,
      swipe: {}
    };
    this.audioRecorderPlayer = recorderPlayer;
    this.audioRecorderPlayer.setSubscriptionDuration(0.2); // optional. Default is 0.5
  }

  componentDidMount() {
    this._isMounted = true;
    const fileRemoteUrl = this.props.voiceUrl;
    if (fileRemoteUrl == null) {
      this._playerPath = this.path;
      if (this.props.playing == true) {
        this.onStartPlay(this.props.voiceState)
      }
    }
    else {
      if (this.props.playing == true)
        this.getPlayLink().then((res) =>
          this.onStartPlay(res)
        )
    }
  }
  componentDidUpdate(prevProp) {
    if (this.props.voiceState != this.state.voiceKey) {
      if (this.state.isStarted == true && this.state.isPlaying == false) {
        this.onResumePlay();
      }
      this.onStopPlay();
    }
  }

  componentWillUnmount() {
    this.onStopPlay();
    this._isMounted = false;
  }
  _onTouchStart = (e) => {
    if (this.state.isPlaying) {
      this.setState({ swipe: { x: e.nativeEvent.pageX } })
    }
  }

  _onTouchEnd = (e) => {
    if (this.state.swipe.x) {
      const absX = e.nativeEvent.pageX - this.state.swipe.x;
      let positionSec = this.state.currentPositionSec;
      positionSec += this.state.currentDurationSec * absX / windowWidth;
      if (positionSec < 0) positionSec = 0;
      if (positionSec > this.state.currentDurationSec) positionSec = this.state.currentDurationSec;
      this.audioRecorderPlayer.seekToPlayer(positionSec);
      this.setState({ swipe: {} });
    }
  }

  changePlayStatus = () => {
    if (this.state.isPlaying)
      this.onPausePlay();
    else if (this.state.isStarted)
      this.onResumePlay();
    else {
      if (this.props.voiceUrl == null) {
        this.onStartPlay(this.props.voiceState);
      }
      else
        this.getPlayLink().then((res) => {
          this.onStartPlay(res);
        })
    }
  }

  onReplay = () => {
    if (this.state.isPlaying)
      this.audioRecorderPlayer.seekToPlayer(0);
    else if (this.state.isStarted) {
      this.audioRecorderPlayer.seekToPlayer(0);
      this.onResumePlay();
    }
    else {
      if (this.props.voiceUrl == null) {
        this.onStartPlay(this.props.voiceState);
      }
      else
        this.getPlayLink().then((res) => {
          this.onStartPlay(res);
        })
    }
  }

  render() {
    let waveCom = [];
    let waveWidth = this.props.tinWidth ? this.props.tinWidth : 1.55;
    let mrg = this.props.mrg ? this.props.mrg : 0.45;
    this.waveHeight = this.props.height ? this.props.height : 39;
    for (let i = 0; i < 80; i++) {
      let h;
      if (this.state.isPlaying) h = Math.floor(Math.random() * this.waveHeight) + 1;
      else h = this.waveheights[i] * this.waveHeight / 39.0;
      waveCom.push(
        <LinearGradient
          colors={this.props.waveColor}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          key={i}
          style={{
            width: waveWidth,
            height: h,
            borderRadius: 4,
            marginRight: mrg,
            marginLeft: mrg
          }}
        >
        </LinearGradient>
      );
    }
    return (
      <View
        style={[styles.rowSpaceBetween, { paddingHorizontal: 8 }]}
      >
        {this.props.playBtn && <TouchableOpacity onPress={() => this.changePlayStatus()}>
          <SvgXml
            width={windowWidth / (this.props.playBtnSize ? this.props.playBtnSize : 10)}
            height={windowWidth / (this.props.playBtnSize ? this.props.playBtnSize : 10)}
            style={{
              marginRight: 8
            }}
            xml={this.state.isPlaying ? pauseSvg : playSvg}
          />
        </TouchableOpacity>}
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: this.waveHeight + 1,
            }}
          // onTouchStart={this._onTouchStart}
          // onTouchEnd={this._onTouchEnd}
          >
            {waveCom}
          </View>
          {this.state.isStarted == true && <View style={[styles.rowSpaceBetween, { marginTop: 10 }]}>
            <DescriptionText
              text={new Date(Math.max(this.state.currentPositionSec, 0)).toISOString().substr(14, 5)}
              lineHeight={13}
              fontSize={13}
            />
            <DescriptionText
              text={new Date(this.state.currentDurationSec - this.state.currentPositionSec).toISOString().substr(14, 5)}
              lineHeight={13}
              fontSize={13}
            />
          </View>}
        </View>
        {this.props.replayBtn &&
          <TouchableOpacity onPress={() => this.onReplay()}>
            <SvgXml
              width={windowWidth / 10}
              height={windowWidth / 10}
              style={{
                marginLeft: 8
              }}
              xml={replaySvg}
            />
          </TouchableOpacity>}
        {this.props.rPlayBtn && <TouchableOpacity onPress={() => this.changePlayStatus()} style={{ marginLeft: 10 }}>
          <SvgXml
            width={40}
            height={40}
            xml={this.state.isPlaying ? pauseSvg : playSvg}
          />
        </TouchableOpacity>}
      </View>

    );
  }

  // onStatusPress = (e) => {
  //   const touchX = e.nativeEvent.locationX;
  //   const playWidth =
  //     (this.state.currentPositionSec / this.state.currentDurationSec) *
  //     (screenWidth - 56);
  //   const currentPosition = Math.round(this.state.currentPositionSec);

  //   if (playWidth && playWidth < touchX) {
  //     const addSecs = Math.round(currentPosition + 1000);
  //     this.audioRecorderPlayer.seekToPlayer(addSecs);
  //   } else {
  //     const subSecs = Math.round(currentPosition - 1000);
  //     this.audioRecorderPlayer.seekToPlayer(subSecs);
  //   }
  // };

  getPlayLink = async () => {
    let { voiceState, actions } = this.props;
    this.setState({
      voiceKey: voiceState + 1,
      isStarted: true,
      isPlaying: true,
      currentPositionSec: 0
    });
    actions.setVoiceState(voiceState + 1);
    const fileRemoteUrl = this.props.voiceUrl;
    const fileExtension = Platform.select({
      ios: 'm4a',
      android: `mp3`,
    });
    const dirs = RNFetchBlob.fs.dirs.CacheDir;
    const path = Platform.select({
      ios: `${dirs}/ss.m4a`,
      android: `${dirs}/ss.mp3`,
    });
    return await RNFetchBlob.config({
      fileCache: false,
      appendExt: fileExtension,
      path,
    }).fetch('GET', fileRemoteUrl).then(res => {
      if (this._isMounted && res.respInfo.status == 200) {
        this._playerPath = `${Platform.OS === 'android' ? res.path() : 'ss.m4a'}`;
        return voiceState + 1;
      }
    })
      .catch(err => {
        this.onStopPlay();
      })
  }

  onStartPlay = async (res) => {
    let { voiceState } = this.props;
    if (res != voiceState) {
      this.onStopPlay();
      return;
    }
    try {
      if (this.state.isStarted == false)
        this.setState({
          isStarted: true,
          isPlaying: true,
          currentPositionSec: 0
        });
      this.props.startPlay();
      const msg = await this.audioRecorderPlayer.startPlayer(this._playerPath);
      const volume = await this.audioRecorderPlayer.setVolume(1.0);
      this.audioRecorderPlayer.addPlayBackListener((e) => {
        if (this._isMounted) {
          if (this.state.isPlaying)
            this.setState({
              currentPositionSec: e.currentPosition,
              currentDurationSec: e.duration,
            });
          if (e.currentPosition == e.duration) {
            this.onStopPlay();
          }
        }
        else {
          this.audioRecorderPlayer.stopPlayer();
          this.audioRecorderPlayer.removePlayBackListener();
        }
      });
    }
    catch (err) {
      this.onStopPlay();
    }
  };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
    this.setState({
      isPlaying: false
    })
  };

  onResumePlay = async () => {
    await this.audioRecorderPlayer.resumePlayer();
    this.setState({
      isPlaying: true
    })
  };

  onStopPlay = async () => {
    if (this.state.isStarted == true) {
      this.setState({ isPlaying: false, isStarted: false, currentPositionSec: 0, currentDurationSec: 0 });
      try {
        await this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.removePlayBackListener();
      }
      catch (err) {
        console.log(err);
      }
    }
    this.props.stopPlay();
  };
}

const mapStateToProps = state => ({
  voiceState: state.user.voiceState,
});

const ActionCreators = Object.assign(
  {},
  { setVoiceState },
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoicePlayer)