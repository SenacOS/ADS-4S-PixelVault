import { StyleSheet, Text, View } from 'react-native';

export default function CatalogScreen() {
  return (
    <View style={styles.container}>
      <Text>Catalog</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});