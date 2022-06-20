import React from "react";
import { View } from "react-native";

export const MyProgressBar = ({
  progress
}) => {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 0 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View>
      <View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 1 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 2 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 3 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 4 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 5 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 6 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View><View style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: progress == 7 ? '#8327D8' : 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 12
      }}>
      </View>
    </View>
  );
};
