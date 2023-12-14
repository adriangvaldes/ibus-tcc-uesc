import { SafeAreaView, Text, View, StyleSheet, StatusBar, Switch } from "react-native";
import { colors } from "../../colors";
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useMemo, useRef, useState } from "react";
import { getStops } from "../../utils/busStops";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from "moti";
import { estimationVehiclesArrive } from "../../Functions/extracData";
import { ActivityIndicator } from "react-native-paper";
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

type BusStopT = {
  tag: string;
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
  lat: string;
  lon: string;
}

export function StopsMap() {
  const mapRef = useRef<any>(null)
  const [modalStopInfoShow, setModalStopInfoShow] = useState(false);
  const [stopSelected, setStopSelected] = useState<BusStopT | null>(null);
  const [busStops, setBusStops] = useState<BusStopT[]>([]);
  const [direction, setDirection] = useState<'east' | 'west'>('east')
  const [busesInCirculation, setBusesInCirculation] = useState<Bus[]>([])
  const [loading, setLoading] = useState(false);

  function onMapReady() {
    if (!!mapRef.current) {
      setCenter()
    }
  }

  useEffect(() => {
    setBusStops(getStops(direction));
  }, [direction])

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
    setModalStopInfoShow(true);
    setLoading(true);
    const data = await estimationVehiclesArrive(direction === 'east' ? 1 : 2, stop.tag);
    if (data?.length > 0) setBusesInCirculation(data);
    setStopSelected(stop);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.switchDirectionContainer}>
          <Text style={{ fontWeight: 'bold' }}>West</Text>
          <Switch
            value={direction === 'east'}
            trackColor={{ false: colors.grey300, true: colors.grey300 }}
            thumbColor={colors.black}
            onValueChange={(value) => setDirection(!value ? 'west' : 'east')}
          />
          <Text style={{ fontWeight: 'bold' }}>East</Text>
        </View>
        {modalStopInfoShow &&
          <MotiView
            style={styles.modalContainer}
            from={{ translateY: 200 }}
            animate={{ translateY: 0 }}
            exit={{
              translateY: 200,
            }}
            transition={{ type: 'timing' }}
          >
            {!loading ? <>
              <Text style={{ position: 'absolute', right: 20, top: 10, color: colors.black, fontWeight: 'bold' }}
                onPress={() => setModalStopInfoShow(false)}>X</Text>
              {busesInCirculation.length > 0 ?
                <>
                  <Text style={styles.stopModalTitle}>{stopSelected?.title}</Text>
                  {busesInCirculation.map(bus =>
                    <View style={styles.busArriveInfoContainer} key={bus.id}>
                      <MaterialCommunityIcons name="bus-clock" size={32} color="black" />
                      <Text style={styles.busIdText}>{bus.id}</Text>
                      <Text style={styles.timeBusText}>-  ~ <Text style={styles.numberTime}>{Math.round(bus.arrivalTime)}</Text>  min...</Text>
                    </View>)}
                </>
                :
                <Text style={{ textAlign: 'center', color: colors.grey300 }}>Sem informação no momento</Text>
              }
            </>
              :
              <ActivityIndicator animating={true} color={colors.black} style={{ position: 'absolute', top: '50%', right: '50%' }} />
            }
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
          {busesInCirculation.length > 0 && busesInCirculation.map(bus => (
            <Marker
              key={bus.id}
              coordinate={{ latitude: parseFloat(bus.lat), longitude: parseFloat(bus.lon) }}
              title={bus.id}
            // image={require('../../assets/busStop2.png')}
            // onPress={() => getBusInfo(stop)}
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
    minHeight: 100,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4
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
  switchDirectionContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 4,
    zIndex: 99,
    position: 'absolute',
    right: 10,
    top: 10,
  },
});