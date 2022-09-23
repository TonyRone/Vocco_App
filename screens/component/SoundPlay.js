import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound'

export const SoundPlay = ({
  path,
  playSpeed
}) => {

  const mounted = useRef(false);

  Sound.setCategory('playback');
  let audio = new Sound(
    path,
    null,
    error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      };
      // if loaded successfully  
      console.log(
        'Duration in seconds:' +
        audio.getDuration() +
        'Number of channels:' +
        audio.getNumberOfChannels(),
      );
    } 
  );

useEffect(() => {
  audio.setSpeed(playSpeed);
  console.log(playSpeed," audio play speed");
}, [playSpeed])

useEffect(() => {
  mounted.current = true;
  audio.setVolume(1);
  audio.play(success=>{
    console.log('audio play ended successfully');
  })
  return () => {
    mounted.current = false;
    audio.stop(success=>{
      console.log('audio stop ended successfully');
    });
    audio.release();
  }
}, [])

return (
  <View>
  </View>
);
};
