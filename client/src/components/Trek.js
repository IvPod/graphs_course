import L from 'leaflet'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useRef } from 'react'
import {
  useMap,
  Polyline,
  Circle,
  LayersControl,
  FeatureGroup,
  Tooltip,
} from 'react-leaflet'
import { useLazyQuery, gql } from '@apollo/client'

import alert from '../utils/alert'
import bfsSearch from '../utils/bfs'
import dijkstraSearch from '../utils/dijkstra'
import aStarSearch from '../utils/astar'
import closestPoints from '../utils/closest_points'

const Trek = ({ start, finish }) => {
  const map = useMap()
  const divRef = useRef(null)

  useEffect(() => {
    L.DomEvent.disableClickPropagation(divRef.current)
  }, [])

  const GET_GRAPH = gql`
    query Treks(
      $bb: String!
      $start: [Float]
      $finish: [Float]
    ) {
      graphInBox(bb: $bb, start: $start, finish: $finish) {
        id
        coordinates
        heuristic
        edges {
          node
          weight
        }
      }
    }
  `

  const [getGraph, { loading, error, data }] =
    useLazyQuery(GET_GRAPH)

  const resultLayer = (result, algorithm, color) => (
    <LayersControl.Overlay name={`Алгоритм ${algorithm}`}>
      <FeatureGroup>
        <Tooltip>
          {' '}
          {`Алгоритм ${algorithm}`} <br />{' '}
          {result.distance &&
            `Длина маршрута = ${result.distance.toFixed(
              1
            )} (м)`}{' '}
          <br />{' '}
          {`Пройдено узлов: ${result.visitedPoints.length}`}{' '}
        </Tooltip>
        <Polyline
          pathOptions={{ color: 'lightskyblue' }}
          positions={result.line}
        />
        {result.visitedPoints.map((point) => (
          <Circle
            center={point}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.8,
            }}
            stroke={false}
            radius={10}
            key={uuidv4()}
          />
        ))}
      </FeatureGroup>
    </LayersControl.Overlay>
  )

  const treksButton = (
    <div className="leaflet-top leaflet-right" ref={divRef}>
      <div className="leaflet-control">
        <button
          type="button"
          className="btn btn-primary"
          disabled={loading}
          onClick={() =>
            getGraph({
              variables: {
                bb: map.getBounds().toBBoxString(),
                start: [start.lat, start.lng],
                finish: [finish.lat, finish.lng],
              },
            })
          }
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Маршруты"
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            ></span>
          ) : (
            <i className="bi bi-compass"></i>
          )}
        </button>
      </div>
    </div>
  )

  if (error) {
    alert(
      'Ошибка построения, вероятно, слишком большая область!',
      'warning'
    )
    return treksButton
  }

  if (data) {
    const adjList = new Map()
    data.graphInBox.forEach(({ id, ...rest }) =>
      adjList.set(id, rest)
    )
    const cp = closestPoints(
      adjList,
      [start.lat, start.lng],
      [finish.lat, finish.lng]
    )

    const resultBFS = bfsSearch(adjList, cp[0], cp[1])
    const resultDijikstra = dijkstraSearch(
      adjList,
      cp[0],
      cp[1]
    )
    const resultAStar = aStarSearch(adjList, cp[0], cp[1])

    return (
      <>
        <Circle
          center={adjList.get(cp[0]).coordinates}
          pathOptions={{
            fillColor: 'blue',
            fillOpacity: 0.8,
          }}
          stroke={false}
          radius={20}
        />
        <Circle
          center={adjList.get(cp[1]).coordinates}
          pathOptions={{
            fillColor: 'blue',
            fillOpacity: 0.8,
          }}
          stroke={false}
          radius={20}
        />
        <LayersControl position="topleft">
          {resultBFS &&
            resultLayer(resultBFS, 'BFS', '#f96')}
          {resultDijikstra &&
            resultLayer(
              resultDijikstra,
              'Dijikstra',
              '#0cc'
            )}
          {resultAStar &&
            resultLayer(resultAStar, 'A*', '#e75480')}
        </LayersControl>
      </>
    )
  }

  return treksButton
}

export default Trek
