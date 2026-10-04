import React from "react";
import { View, StyleSheet } from "react-native";

type IconProps = {
  size?: number;
  color?: string;
};

export function CheckCircleIcon({ size = 20, color = "#4ADE80" }: IconProps) {
  return (
    <View
      style={[
        styles.circleIcon,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <View
        style={{
          width: size * 0.35,
          height: size * 0.2,
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderColor: color,
          transform: [{ rotate: "-45deg" }],
          marginTop: -size * 0.04,
        }}
      />
    </View>
  );
}

export function XCircleIcon({ size = 20, color = "#F87171" }: IconProps) {
  const lineLen = size * 0.3;
  return (
    <View
      style={[
        styles.circleIcon,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <View style={{ width: lineLen, height: lineLen }}>
        <View
          style={{
            position: "absolute",
            width: lineLen * 1.4,
            height: 2,
            backgroundColor: color,
            top: lineLen / 2 - 1,
            left: -lineLen * 0.2,
            transform: [{ rotate: "45deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: lineLen * 1.4,
            height: 2,
            backgroundColor: color,
            top: lineLen / 2 - 1,
            left: -lineLen * 0.2,
            transform: [{ rotate: "-45deg" }],
          }}
        />
      </View>
    </View>
  );
}

export function AlertTriangleIcon({ size = 20, color = "#FBBF24" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.45,
          borderRightWidth: size * 0.45,
          borderBottomWidth: size * 0.8,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
          opacity: 0.25,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 2,
          height: size * 0.25,
          backgroundColor: color,
          top: size * 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: color,
          top: size * 0.62,
        }}
      />
    </View>
  );
}

export function InfoIcon({ size = 20, color = "#60A5FA" }: IconProps) {
  return (
    <View
      style={[
        styles.circleIcon,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <View
        style={{
          width: 2,
          height: size * 0.22,
          backgroundColor: color,
          marginTop: size * 0.05,
        }}
      />
      <View
        style={{
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: color,
          marginTop: 2,
        }}
      />
    </View>
  );
}

export function WifiIcon({ size = 20, color = "#4ADE80" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          width: size * 0.8,
          height: size * 0.4,
          borderTopLeftRadius: size * 0.4,
          borderTopRightRadius: size * 0.4,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
          opacity: 0.3,
          position: "absolute",
          top: size * 0.1,
        }}
      />
      <View
        style={{
          width: size * 0.5,
          height: size * 0.25,
          borderTopLeftRadius: size * 0.25,
          borderTopRightRadius: size * 0.25,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
          opacity: 0.6,
          position: "absolute",
          top: size * 0.3,
        }}
      />
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
          marginBottom: size * 0.12,
        }}
      />
    </View>
  );
}

export function WifiOffIcon({ size = 20, color = "#F87171" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          width: size * 0.8,
          height: size * 0.4,
          borderTopLeftRadius: size * 0.4,
          borderTopRightRadius: size * 0.4,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
          opacity: 0.15,
          position: "absolute",
          top: size * 0.1,
        }}
      />
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
          opacity: 0.4,
          marginBottom: size * 0.12,
        }}
      />
      {/* Slash */}
      <View
        style={{
          position: "absolute",
          width: size * 0.9,
          height: 2,
          backgroundColor: color,
          top: size * 0.45,
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
}

export function ClipboardIcon({ size = 48, color = "#53EAFD" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Board */}
      <View
        style={{
          width: size * 0.6,
          height: size * 0.7,
          borderRadius: size * 0.08,
          borderWidth: 2,
          borderColor: color,
          opacity: 0.4,
          position: "absolute",
          bottom: 0,
        }}
      />
      {/* Clip */}
      <View
        style={{
          width: size * 0.3,
          height: size * 0.15,
          borderTopLeftRadius: size * 0.08,
          borderTopRightRadius: size * 0.08,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
          position: "absolute",
          top: size * 0.08,
        }}
      />
      {/* Lines */}
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: size * 0.3,
            height: 2,
            backgroundColor: color,
            opacity: 0.5 - i * 0.1,
            position: "absolute",
            top: size * 0.42 + i * size * 0.12,
          }}
        />
      ))}
    </View>
  );
}

export function CameraIcon({ size = 20, color = "#64748B" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.8,
          height: size * 0.55,
          borderRadius: size * 0.08,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
          marginTop: size * 0.1,
        }}
      >
        <View
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: size * 0.14,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
      </View>
      <View
        style={{
          width: size * 0.25,
          height: size * 0.1,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          position: "absolute",
          top: size * 0.12,
        }}
      />
    </View>
  );
}

export function RefreshIcon({ size = 18, color = "#94A3B8" }: IconProps) {
  return (
    <View
      style={[
        styles.circleIcon,
        {
          width: size,
          height: size,
          borderColor: color,
          borderRightColor: "transparent",
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          right: -1,
          top: size * 0.05,
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderTopWidth: 3,
          borderBottomWidth: 3,
          borderLeftColor: color,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circleIcon: {
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
