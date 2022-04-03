import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { useMap, Polyline } from 'react-leaflet'
import { useLazyQuery, gql } from '@apollo/client'

import alert from '../utils/alert'

const Roads = () => {
  const map = useMap()
  const divRef = useRef(null)

  useEffect(() => {
    L.DomEvent.disableClickPropagation(divRef.current)
  }, [])

  const PLOT_ROADS = gql`
    query Roads($bb: String!) {
      roads(bb: $bb) {
        coordinates
      }
    }
  `
  const [plotRoads, { loading, error, data }] =
    useLazyQuery(PLOT_ROADS)

  const roadsButton = (
    <div
      className="leaflet-bottom leaflet-right"
      ref={divRef}
    >
      <div className="leaflet-control">
        <button
          type="button"
          className="btn btn-primary"
          disabled={loading}
          onClick={() =>
            plotRoads({
              variables: {
                bb: map.getBounds().toBBoxString(),
              },
            })
          }
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Дороги"
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            ></span>
          ) : (
            <i className="bi bi-signpost-split"></i>
          )}
        </button>
      </div>
    </div>
  )
  if (error) {
    alert(
      'Ошибка построения, возможно, слишком большая область!',
      'warning'
    )
    return roadsButton
  }

  if (data) {
    let lines = []
    data?.roads?.forEach((road) =>
      lines.push(road.coordinates)
    )
    return (
      <>
        <Polyline
          pathOptions={{ color: 'lightskyblue' }}
          positions={lines}
        />
        {roadsButton}
      </>
    )
  }
  return roadsButton
}

export default Roads
