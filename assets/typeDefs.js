const { gql } = require('apollo-server')

const typeDefs = gql`
  type Tags {
    highway: String
    surface: String
    name: String
  }
  type Way {
    id: ID!
    tags: Tags
    nodes: [ID]!
    coordinates: [[Float]]!
  }
  type Weather {
    name: String
    description: String
    temp: Float
    pressure: Int
    humidity: Float
    windSpeed: Float
  }
  type Node {
    id: ID
    coordinates: [Float]
    heuristic: Float
    edges: [Edge]
  }
  type Edge {
    node: ID
    weight: Float
  }
  type Query {
    roads(bb: String): [Way]
    weather(lat: Float, lon: Float): Weather
    graphInBox(
      bb: String
      start: [Float]
      finish: [Float]
    ): [Node]
  }
`

module.exports = typeDefs
