import React from "react";
import { Text } from "react-native";

export const CommenText = ({
  text,
  fontFamily = "SFProDisplay-Bold",
  textAlign = "left",
  color = "#281E30",
  numberOfLines,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  fontSize = 20,
  lineHeight = 24,
  maxWidth ,
}) => {
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: color,
        textAlign: textAlign,
        maxWidth: maxWidth,
        marginBottom: marginBottom,
        marginTop: marginTop,
        marginLeft:marginLeft,
        marginRight:marginRight,
        lineHeight:lineHeight
      }}
    >
      {text}
    </Text>
  );
};
