import { StyleSheet, Text, View } from 'react-native';

export default function GameDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Game Detail</Text>
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