import { SafeAreaView, Text, View, StyleSheet, StatusBar } from "react-native";
import { colors } from "../../colors";
import MapView, { Marker } from 'react-native-maps';
import { useRef, useState } from "react";
import { busStops } from "../../utils/busStops";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GetBusLocations } from "../../api/axios";
import { MotiView } from "moti";
import { estimationVehiclesArrive } from "../../Functions/extracData";
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

type BusStopT = {
  title: string;
  shortTitle?: string;
  lat: string;
  lon: string;
  stopId?: string;
}
type Bus = {
  id: string;
  distance: number;
  arrivalTime: number;
}

export function Home() {
  const mapRef = useRef<any>(null)
  const [modalStopInfoShow, setModalStopInfoShow] = useState(false);
  const [stopSelected, setStopSelected] = useState<BusStopT | null>(null);
  const [busesInCirculation, setBusesInCirculation] = useState<Bus[]>([])
  function onMapReady() {
    if (!!mapRef.current) {
      setCenter()
    }
  }

  function setCenter() {
    if (!mapRef.current) {
      return
    }

    mapRef?.current?.animateToRegion({
      latitude: 40.71418,
      longitude: -74.00631,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    })
  }

  async function getBusInfo(stop: BusStopT) {
    // const busData = await GetBusLocations();
    const data = await estimationVehiclesArrive(1, 5);
    if (data?.length > 0) setBusesInCirculation(data);
    setModalStopInfoShow(true);
    setStopSelected(stop);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.contentContainer}>
        {modalStopInfoShow &&
          <MotiView
            style={styles.modalContainer}
            from={{ translateY: 65 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'timing' }}
          >
            <Text style={styles.stopModalTitle}>{stopSelected?.title}</Text>
            <Text style={{ position: 'absolute', right: 20, top: 10, color: colors.grey300 }} onPress={() => setModalStopInfoShow(false)}>X</Text>
            {busesInCirculation.length > 0 &&
              busesInCirculation.map(bus =>
                <View style={styles.busArriveInfoContainer} key={bus.id}>
                  <MaterialCommunityIcons name="bus-clock" size={32} color="black" />
                  <Text style={styles.busIdText}>{bus.id}</Text>
                  <Text style={styles.timeBusText}>-  ~ <Text style={styles.numberTime}>{Math.round(bus.arrivalTime)}</Text>  min...</Text>
                </View>
              )}
          </MotiView>
        }
        <MapView
          ref={mapRef}
          style={{ flex: 1, zIndex: 1 }}
          onMapReady={onMapReady}
          scrollEnabled={true}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsScale={false}
          showsTraffic={false}
          toolbarEnabled={false}
        >
          {busStops.map((stop, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: parseFloat(stop.lat), longitude: parseFloat(stop.lon) }}
              title={stop.title}
              description={stop.title}
              image={require('../../assets/busStop2.png')}
              onPress={() => getBusInfo(stop)}
            />
          ))}

        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
  },
  modalContainer: {
    zIndex: 99,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10
  },
  stopModalTitle: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  busArriveInfoContainer: {
    marginLeft: 0,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  busIdText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeBusText: {
    fontSize: 16
  },
  numberTime: {
    color: colors.foregGround,
    fontWeight: 'bold',
  },
});