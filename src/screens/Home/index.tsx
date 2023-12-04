import { SafeAreaView, Text, View, StyleSheet, StatusBar, Switch } from "react-native";
import { colors } from "../../colors";
import { Button } from "react-native-paper";


export function Home({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.container}>
        <Text>ICONE</Text>
        <Text>ICONE</Text>
        <Button buttonColor={colors.black} textColor={colors.white} onPress={() => navigation.navigate('StopsMap')}>COMEÇAR</Button>
        <Text style={{ color: colors.grey300, fontSize: 12, textAlign: 'center' }}>Copyright © 2023 Adrian Valdes</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignContent: 'center'
  },
});