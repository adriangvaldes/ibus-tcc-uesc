import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { vehicleLocation } from './Data/vehiclesLocations';
import { caminhoEast } from './Data/caminho_east';
import { caminhoWest } from './Data/caminho_west';
import { paradasEast } from './Data/paradas_east';
import { paradasWest } from './Data/paradas_west';
import { eastStops, westStops } from '../utils/busStops';


const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "$",
  allowBooleanAttributes: true
};
const parser = new XMLParser(options);

export async function estimationVehiclesArrive(sentido: 1 | 2, stopTag: string) {
  //Initial part
  let predictions: any[] = [];
  const request_stop = sentido === 1 ? eastStops.findIndex(stop => stop === stopTag) : westStops.findIndex(stop => stop === stopTag)

  let coords: Array<any>;
  let parada: any;
  let velocidade: number;

  if (sentido === 1) {
    coords = caminhoEast;
    parada = paradasEast;
    velocidade = 1 / 0.006747;
  } else {
    coords = caminhoWest;
    parada = paradasWest;
    velocidade = 1 / 0.006747;
  }

  const unidadeDist = coords[1][3];
  //

  const timeStamp = Date.now() - 10000;
  const commands = `command=vehicleLocations&a=da&r=dtconn&t=${timeStamp}`
  // const commands = `command=vehicleLocations&a=da&r=dtconn&`
  const url = `https://retro.umoiq.com/service/publicXMLFeed?${commands}`
  // const response = await axios.get(url);

  let lines: any[] = []

  const response = vehicleLocation; // CHANGE TO DEFINITIVE
  const parsedObject = parser.parse(response.replace('?xml', 'xml'))

  // const parsedObject = parser.parse(response.data.replace('?xml', 'xml'))


  if (parsedObject?.xml?.body?.vehicle?.length > 0) {
    const linesToAdd = parsedObject?.xml?.body?.vehicle.map((vehicle: any) => ([
      timeStamp,
      vehicle['$id'],
      vehicle['$dirTag'] === 'west' ? 2 : vehicle['$dirTag'] === 'east' ? 1 : 0,
      vehicle['$lat'],
      vehicle['$lon'],
      timeStamp,
      vehicle['$speedKmHr'],
    ]))
    lines = [...linesToAdd]
  } else if (parsedObject?.xml?.body?.vehicle['$id']) lines = [[
    timeStamp,
    parsedObject?.xml?.body?.vehicle['$id'],
    parsedObject?.xml?.body?.vehicle['$dirTag'] === 'west' ? 2 : parsedObject?.xml?.body?.vehicle['$dirTag'] === 'east' ? 1 : 0,
    parsedObject?.xml?.body?.vehicle['$lat'],
    parsedObject?.xml?.body?.vehicle['$lon'],
    timeStamp,
    parsedObject?.xml?.body?.vehicle['$speedKmHr'],
  ]]

  console.log(lines, request_stop);

  //Parte de predição
  const n = lines.length;
  let menorDistancia = 10000;
  let indiceMinimo = 0;
  let nOnibus = 0;

  // console.log(lines);


  lines.forEach(line => {
    if (line[2] === sentido) {
      coords.forEach((coord, index) => {
        const distancia = Math.sqrt((Math.pow((line[3] - coord[1]), 2) + Math.pow((line[4] - coord[2]), 2)))

        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          indiceMinimo = index;
        }
      })
      if (indiceMinimo < parada[request_stop][1]) {
        nOnibus = nOnibus + 1;
        const distance = (parada[request_stop][1] - indiceMinimo) * unidadeDist;
        console.log(indiceMinimo);

        const tempo = distance / velocidade;
        predictions.push({
          id: line[1],
          distance,
          arrivalTime: tempo,
          lat: line[3],
          lon: line[4]
        })
      }
    }
  })
  return predictions
}