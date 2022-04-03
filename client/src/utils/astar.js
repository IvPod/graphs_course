import distance from './distance'

// Выбор следующего узла, движемся по Map, пока элементы есть в списке посещенных
// ==========================================================================
const nextNode = (distMap, visited, graph) => {
  let next = null

  distMap.forEach((value, key) => {
    let currentIsClosest =
      next === null ||
      value + graph.get(key).heuristic <
        distMap.get(next) + graph.get(next).heuristic
    if (currentIsClosest && !visited.includes(key)) {
      next = key
    }
  })
  return next
}

// Основная логика поиска пути
// ==========================================================================
const astarSearch = (graph, startNode, endNode) => {
  const distMap = new Map()
  const endCoordinates = graph.get(endNode).coordinates
  graph.forEach((value, key, map) => {
    map.set(key, {
      ...value,
      heuristic: distance(
        value.coordinates,
        endCoordinates
      ),
    })
  })

  graph
    .get(startNode)
    .edges.forEach((child) =>
      distMap.set(child.node, child.weight)
    )

  const parents = { endNode: null }
  graph
    .get(startNode)
    .edges.forEach(
      (child) => (parents[child.node] = startNode)
    )

  const visited = []
  let node = nextNode(distMap, visited, graph)

  // Если заменить следующую строку на "while (node) { " - получится фактически полный перебор brute force search
  while (node && node !== endNode) {
    let distance = distMap.get(node)

    let children = graph.get(node).edges
    // eslint-disable-next-line no-loop-func
    children.forEach((child) => {
      if (child.node !== startNode) {
        let newdistance = distance + child.weight
        if (
          !distMap.get(child.node) ||
          distMap.get(child.node) > newdistance
        ) {
          distMap.set(child.node, newdistance)
          parents[child.node] = node
        }
      }
    })

    visited.push(node)
    node = nextNode(distMap, visited, graph)
  }

  // -------------------------------------
  const shortestPath = [endNode]
  let parent = parents[endNode]

  while (parent) {
    shortestPath.push(parent)
    parent = parents[parent]
  }
  shortestPath.reverse()

  const line = []
  shortestPath.map((node) =>
    line.push(graph.get(node).coordinates)
  )

  const visitedPoints = []
  visited.map((node) =>
    visitedPoints.push(graph.get(node).coordinates)
  )

  return {
    distance: distMap.get(endNode),
    path: shortestPath,
    line,
    visitedPoints,
  }
}

export default astarSearch
