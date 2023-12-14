import { SafeAreaView, Text, View, StyleSheet, StatusBar, Switch } from "react-native";
import { colors } from "../../colors";
import { Button } from "react-native-paper";


export function Home({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.container}>
        <View style={{ height: '100%', justifyContent: 'space-between', paddingVertical: 50 }}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBorderContainer}>
              <Text style={styles.logoText}>iBus</Text>
            </View>
            <View>
              <Text style={{ textAlign: 'center' }}>Não fique parado nas paradas</Text>
              <Text style={{ textAlign: 'center' }}>Vá no tempo certo!</Text>
            </View>
          </View>
          <Button buttonColor={colors.black} textColor={colors.white} style={{ marginTop: 100 }} onPress={() => navigation.navigate('StopsMap')}>COMEÇAR</Button>
        </View>
        <Text style={{ color: colors.grey300, fontSize: 12, textAlign: 'center' }}>Copyright © 2023 Adrian Valdes</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  logoContainer: {
    // height: '100%
    padding: 40,
    justifyContent: 'space-between',
    fontFamily: '',
    flex: 1,
  },
  logoBorderContainer: {
    backgroundColor: 'black',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 999,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 90,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});