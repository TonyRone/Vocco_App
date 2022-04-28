import React from "react";
import { Text } from "react-native";

export const TitleText = ({
  text,
  fontFamily = "SFProDisplay-Bold",
  textAlign = "left",
  color = "#281E30",
  numberOfLines,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  fontSize = 28,
  letterSpaceing,
  lineHeight
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: color,
        textAlign: textAlign,
        marginBottom: marginBottom,
        marginTop: marginTop,
        marginLeft:marginLeft,
        marginRight:marginRight,
        lineHeight:lineHeight,
      }}
    >
      {text}
    </Text>
  );
};
