import { useQuery, gql } from '@apollo/client'

const GET_WEATHER = gql`
  query GetWeather($lat: Float, $lon: Float) {
    weather(lat: $lat, lon: $lon) {
      name
      description
      temp
      humidity
      pressure
      windSpeed
    }
  }
`
const Weather = ({ location }) => {
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { lat: location.lat, lon: location.lng },
  })

  if (error) {
    return (
      <div>
        <p>Нет данных</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }

  return (
    <div className="row align-items-start">
      <div className="col">
        <table className="table table-info table-sm">
          <tbody>
            <tr>
              <th scope="row">Адрес</th>
              <td>
                {data?.weather ? data.weather.name : ''}
              </td>
            </tr>
            <tr>
              <th scope="row">Погода</th>
              <td>
                {data?.weather
                  ? data.weather.description
                  : ''}
              </td>
            </tr>
            <tr>
              <th scope="row">Температура</th>
              <td>
                {data?.weather ? data.weather.temp : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col">
        <table className="table table-info table-sm">
          <tbody>
            <tr>
              <th scope="row">Давление</th>
              <td>
                {data?.weather ? data.weather.pressure : ''}
              </td>
            </tr>
            <tr>
              <th scope="row">Влажность</th>
              <td>
                {data?.weather ? data.weather.humidity : ''}
              </td>
            </tr>
            <tr>
              <th scope="row">Скорость ветра</th>
              <td>
                {data?.weather
                  ? data.weather.windSpeed
                  : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Weather
