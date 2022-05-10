import React, {useState, useRef, useEffect} from "react";
import { View , StyleSheet, TouchableOpacity , Image, Text} from "react-native";
import * as Animatable from 'react-native-animatable'  
import Icon from 'react-native-vector-icons/AntDesign'

export const HeartIcon = ({
  isLike = false,
<<<<<<< HEAD
=======
  height = 19,
  marginLeft = 0,
  marginRight = 0,
>>>>>>> origin
  OnSetLike = ()=>{}
}) => {

  const [liked, setLiked] = useState(isLike);

  const AnimatedIcon = Animatable.createAnimatableComponent(Icon);
  const smallAnimatedIcon = useRef();

  const handleOnPressLike = async () => {
    await smallAnimatedIcon.current?.bounceIn();
<<<<<<< HEAD
    setLiked(true);
    OnSetLike();
  }

  useEffect(() => {
    if(isLike != liked && isLike == true){
      handleOnPressLike();
    }
  }, [isLike])
=======
    setLiked(!liked);
  }

  useEffect(() => {
    if(isLike != liked){
      handleOnPressLike();
    }
  },[isLike])
>>>>>>> origin

  return (
    <TouchableOpacity
      activeOpacity={1}
<<<<<<< HEAD
      onPress={handleOnPressLike}
      style={styles.card}
    >
      <AnimatedIcon
        ref={smallAnimatedIcon}
        name={liked ? 'heart' : 'hearto'}
        color={liked ? colors.heartColor : colors.textPrimary}
        size={18}
=======
      onPress={OnSetLike}
      style={{height: height,marginLeft:marginLeft,marginRight:marginRight}}
    >
      <AnimatedIcon
        ref={smallAnimatedIcon}
        name={isLike ? 'heart' : 'hearto'}
        color={isLike ? colors.heartColor : colors.textPrimary}
        size={height}
>>>>>>> origin
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const colors = {
  transparent: 'transparent',
  white: '#fff',
  heartColor: '#e92f3c',
  textPrimary: '#515151',
  black: '#000', 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
<<<<<<< HEAD
    height: 16,
    width: 38,
=======
    
>>>>>>> origin
  },
  image: {
    marginTop: 10,
    height: 280,
    width: '92%'
  },
  photoDescriptionContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10
  },
  icon: {
<<<<<<< HEAD
    paddingHorizontal: 10,
=======
    paddingHorizontal: 0,
>>>>>>> origin
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 160,
    opacity: 0
  },
  text: {
    textAlign: 'center',
    fontSize: 13,
    backgroundColor: colors.transparent,
    color: colors.textPrimary
  },
  textPhotographer: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  polaroidTextContainer: {
    flexDirection: 'row',
    textAlign: 'left',
    paddingTop: 0
  }
})
