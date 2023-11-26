import axios from "axios";
import { parseString } from 'react-native-xml2js';


// Função auxiliar para converter XML DOM para JSON

export async function GetBusLocations() {
  const timeStamp = Date.now() - 8000;
  const commands = `command=vehicleLocations&a=da&r=dtconn&t=${timeStamp}`
  const url = `https://retro.umoiq.com/service/publicXMLFeed?${commands}`
  try {
    let arrayResponse: any = []
    const response = await axios.get(url);
    console.log(response.data);
    parseString(response.data, (err: any, result: any) => {
      arrayResponse = result?.body?.vehicle ? result?.body?.vehicle.map((vehicle: any) => ({
        dirTag: vehicle['$']?.dirTag ?? null,
        id: vehicle['$']?.id ?? null,
        lat: vehicle['$']?.lat ?? null,
        lon: vehicle['$']?.lon ?? null,
      })) : []
    });
    return arrayResponse
  } catch (error) {
    console.log(error)
  }
}

export async function BusArriveCalculation(busId: string, stopLabel: string, lat: string, log: string) {
  //To DO
  return 5
}