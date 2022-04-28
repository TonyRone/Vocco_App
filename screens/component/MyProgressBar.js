import React from "react";
import { View } from "react-native";

export const MyProgressBar = ({
  progress
}) => {
  return (
    <View style={{
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <View style={{
        height:2,
        width:28,
        backgroundColor: progress > 0 ? '#8327D8' : '#D4C9DE',
        marginHorizontal:5
      }}>
      </View>
      <View style={{
        height:2,
        width:28,
        marginHorizontal:5,
        backgroundColor: progress > 1 ? '#8327D8' : '#D4C9DE',
      }}>
      </View>
      <View style={{
        height:2,
        width:28,
        marginHorizontal:5,
        backgroundColor: progress > 2 ? '#8327D8' : '#D4C9DE',
      }}>
      </View>
      <View style={{
        height:2,
        width:28,
        marginHorizontal:5,
        backgroundColor: progress > 3 ? '#8327D8' : '#D4C9DE',
      }}>
      </View>
      <View style={{
        height:2,
        width:28,
        marginHorizontal:5,
        backgroundColor: progress > 4 ? '#8327D8' : '#D4C9DE',
      }}>
      </View>
    </View>
  );
};
