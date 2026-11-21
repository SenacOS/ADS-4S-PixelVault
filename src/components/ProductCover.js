import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { coverForProduct } from '../data/catalogCovers';
import { colors } from '../theme/tokens';
import AppText from './AppText';

export default function ProductCover({ product }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [product.id]);
  if (failed) return <View accessibilityRole="image" accessibilityLabel={`Capa indisponível de ${product.name}`} style={[styles.frame, styles.fallback]}><AppText>Imagem indisponível</AppText></View>;
  return <View style={styles.frame}><Image accessibilityLabel={`Capa de ${product.name}`} source={coverForProduct(product.id)} resizeMode="cover" style={styles.cover} onError={() => setFailed(true)} /></View>;
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  cover: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
