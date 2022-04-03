import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Tooltip,
} from 'react-leaflet'

import MyLocation from './MyLocation'
import Weather from './Weather'
import Roads from './Roads'
import Trek from './Trek'

const App = () => {
  L.Icon.Default.imagePath = '/images/'
  const [location, setLocation] = useState({
    lat: 59.88122,
    lng: 29.90677,
  })

  const [startPosition, setStartPosition] = useState(null)
  const [endPosition, setEndPosition] = useState(null)

  const Moving = () => {
    const map = useMapEvents({
      moveend() {
        setLocation(map.getCenter())
        if (
          startPosition &&
          !map.getBounds().contains(startPosition)
        ) {
          setStartPosition(null)
        }
        if (
          endPosition &&
          !map.getBounds().contains(endPosition)
        ) {
          setEndPosition(null)
        }
      },
      click(e) {
        if (endPosition) {
          setStartPosition(endPosition)
          setEndPosition(e.latlng)
        } else if (startPosition) {
          setEndPosition(e.latlng)
        } else {
          setStartPosition(e.latlng)
        }
      },
    })
    return null
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-between mt-3">
        <div className="col-auto">
          <h1> Graphs 101</h1>
        </div>
        <div className="col-auto">
          <Weather location={location} />
        </div>
      </div>
      <MapContainer
        center={location}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {startPosition && (
          <Marker position={startPosition}>
            <Tooltip>Start</Tooltip>
          </Marker>
        )}
        {endPosition && (
          <Marker position={endPosition}>
            <Tooltip>Finish</Tooltip>
          </Marker>
        )}
        <MyLocation />
        <Roads />
        {startPosition && endPosition ? (
          <Trek
            start={startPosition}
            finish={endPosition}
          />
        ) : null}
        <Moving />
      </MapContainer>
      <div id="alertPlaceholder"></div>
    </div>
  )
}

export default App
