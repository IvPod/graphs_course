const axios = require('axios')
const distance = require('./distance')

const roi = [
  'motorway',
  'trunk',
  'primary',
  'secondary',
  'tertiary',
  'unclassified',
  'residential',
  'living_street',
  'service',
]

const resolvers = {
  Query: {
    roads: (parent, args, context, info) => {
      return axios
        .get(
          `https://www.openstreetmap.org/api/0.6/map?bbox=${args.bb}`
        )
        .then((res) =>
          res.data.elements.filter(
            (el) =>
              (el.type === 'way' &&
                el.tags &&
                roi.includes(el.tags.highway)) ||
              el.type === 'node'
          )
        )
        .then((data) => {
          const nodes = new Map()
          const ways = new Map()
          const lines = []
          data.map((el) => {
            if (el.type === 'node') {
              nodes.set(el.id, [el.lat, el.lon])
            } else if (el.type === 'way') {
              const oneLine = []
              el.nodes.map((node) =>
                oneLine.push(nodes.get(node))
              )
              ways.set(el.id, {
                id: el.id,
                tags: {
                  highway: el.tags.highway,
                  surface: el.tags.surface,
                  name: el.tags.name,
                },
                nodes: el.nodes,
                coordinates: oneLine,
              })
              lines.push(ways.get(el.id))
            }
          })

          return lines
        })
    },
    weather: (parent, args, context, info) => {
      return axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${args.lat}&lon=${args.lon}&appid=3af55b317e23304129635839840efb53&units=metric&lang=ru`
        )
        .then((res) => {
          console.log(res.data)
          const data = res.data
          const result = {
            name: data.name,
            description: data.weather[0].description,
            temp: data.main.temp,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
          }
          return result
        })
        .catch((err) =>
          console.log(
            'Ошибка c погодой: ',
            err.response.status,
            err.response.statusText,
            err.response.data
          )
        )
    },
    graphInBox: (parent, args, context, info) => {
      return axios
        .get(
          `https://www.openstreetmap.org/api/0.6/map?bbox=${args.bb}`
        )
        .then((res) =>
          res.data.elements.filter(
            (el) =>
              (el.type === 'way' &&
                el.tags &&
                roi.includes(el.tags.highway)) ||
              el.type === 'node'
          )
        )
        .then((data) => {
          const nodes = new Map()
          const ways = new Map()
          const adjList = new Map()
          data.map((el) => {
            if (el.type === 'node') {
              nodes.set(el.id, [el.lat, el.lon])
            } else if (el.type === 'way') {
              ways.set(el.id, el.nodes)
            }
          })

          ways.forEach((nodeSet) => {
            let neighbours = []
            for (let i = 0; i < nodeSet.length - 1; i++) {
              neighbours = nodeSet.slice(i, i + 2)
              let alist = adjList.get(neighbours[0])
                ? adjList.get(neighbours[0]).edges
                : []

              const edgeWeight = distance(
                nodes.get(neighbours[0]),
                nodes.get(neighbours[1])
              )
              alist.push({
                node: neighbours[1],
                weight: edgeWeight,
              })
              adjList.set(neighbours[0], {
                coordinates: nodes.get(neighbours[0]),
                edges: alist,
                heuristic: distance(
                  nodes.get(neighbours[0]),
                  args.finish
                ),
              })

              alist = adjList.get(neighbours[1])
                ? adjList.get(neighbours[1]).edges
                : []
              alist.push({
                node: neighbours[0],
                weight: edgeWeight,
              })
              adjList.set(neighbours[1], {
                coordinates: nodes.get(neighbours[1]),
                edges: alist,
                heuristic: distance(
                  nodes.get(neighbours[1]),
                  args.finish
                ),
              })
            }
          })

          const aRet = []
          adjList.forEach((value, key) =>
            aRet.push({ id: key, ...value })
          )
          return aRet
        })
    },
  },
}

module.exports = resolvers
