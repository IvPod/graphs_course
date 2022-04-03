const earthRadiusKm = 6371

// Конвертация градусов в радианы
const deg2rad = (deg) => {
  return (deg * Math.PI) / 180
}

// Вычисление расстояния между двумя точками на поверхности
const distance = (latlon1, latlon2) => {
  const lat1r = deg2rad(latlon1[0])
  const lon1r = deg2rad(latlon1[1])
  const lat2r = deg2rad(latlon2[0])
  const lon2r = deg2rad(latlon2[1])
  const u = Math.sin((lat2r - lat1r) / 2)
  const v = Math.sin((lon2r - lon1r) / 2)

  return (
    2.0 *
    earthRadiusKm *
    Math.asin(
      Math.sqrt(
        u * u + Math.cos(lat1r) * Math.cos(lat2r) * v * v
      )
    ) *
    1000
  )
}

export default distance
