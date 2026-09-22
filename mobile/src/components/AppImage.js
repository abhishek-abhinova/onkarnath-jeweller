import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Renders a backend image with a graceful branded fallback. Since demo seed
// images ship as PNGs in assets, this also handles slow/CDN failures.
export default function AppImage({ source, fallback, style, imageStyle, label }) {
  const [failed, setFailed] = React.useState(false);
  const [src, setSrc] = React.useState(source);

  React.useEffect(() => {
    setSrc(source);
    setFailed(false);
  }, [source]);

  if (!src || failed) {
    return (
      <View style={[styles.fallback, style]}>
        {fallback ? (
          <Image source={fallback} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{label || '✦'}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={imageStyle || style}
      resizeMode="cover"
      onError={() => {
        setFailed(true);
      }}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: COLORS.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.maroon,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.goldLight,
    fontSize: 18,
  },
});