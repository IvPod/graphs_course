import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const MyLocation = () => {
  const map = useMap()
  const divRef = useRef(null)

  useEffect(() => {
    L.DomEvent.disableClickPropagation(divRef.current)
  }, [])

  const findMyLocation = () => {
    map
      .locate()
      .on('locationfound', (e) => {
        map.setView(e.latlng, map.getZoom())
      })
      .on(
        'locationerror',
        console.log('Ошибка позиционирования')
      )
  }
  return (
    <div
      className="leaflet-bottom leaflet-left"
      ref={divRef}
    >
      <div className="leaflet-control">
        <button
          type="button"
          className="btn btn-primary"
          onClick={findMyLocation}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Моя позиция"
        >
          <i className="bi bi-geo-alt"></i>
        </button>
      </div>
    </div>
  )
}

export default MyLocation
