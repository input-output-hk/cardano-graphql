import { ApolloServerBase } from 'apollo-server-core'
import * as fs from 'fs'
import * as path from 'path'
import * as depthLimit from 'graphql-depth-limit'
import { hasuraResolvers, scalarResolvers } from '../resolvers'
import { Resolvers } from '../graphql_types'
import { buildContext } from '../Context'

/**
 * A server compatible with apollo-server-testing
 *
 * Enables direct querying of the service, sans HTTP server.
 *
 * @packageDocumentation
 */

export async function TestApolloServer (): Promise<ApolloServerBase> {
  const context = await buildContext('http://localhost:8090/v1/graphql')
  return new ApolloServerBase({
    context,
    introspection: true,
    resolvers: Object.assign({}, scalarResolvers, hasuraResolvers) as Resolvers,
    typeDefs: fs.readFileSync(path.join(__dirname, '../schema.graphql'), 'UTF8'),
    validationRules: [depthLimit(20)]
  })
}
