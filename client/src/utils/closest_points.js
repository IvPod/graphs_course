import distance from './distance.js'

const closestPoints = (adjList, start, finish) => {
  const minstart = [0, 99999]
  const minfinish = [0, 99999]

  adjList.forEach((node, key) => {
    if (minstart[1] > distance(node.coordinates, start)) {
      minstart[1] = distance(node.coordinates, start)
      minstart[0] = key
    }
    if (minfinish[1] > distance(node.coordinates, finish)) {
      minfinish[1] = distance(node.coordinates, finish)
      minfinish[0] = key
    }
  })

  return [minstart[0], minfinish[0]]
}

export default closestPoints
