import gql from 'graphql-tag'
import { TestClient } from '../TestClient'

export function cardanoTests (createClient: () => Promise<TestClient>) {
  describe('cardano', () => {
    let client: TestClient

    beforeEach(async () => {
      client = await createClient()
    }, 60000)

    it('Returns static information about the network', async () => {
      const result = await client.query({
        query: gql`query {
            cardano {
                networkName
                protocolConst
                slotDuration
                startTime
            }
        }`
      })
      expect(result.data).toMatchSnapshot()
    })
    it('Returns dynamic information about the network', async () => {
      const result = await client.query({
        query: gql`query {
            cardano {
                blockHeight
                currentEpoch {
                    number
                }
            }
        }`
      })
      expect(result.data.cardano.blockHeight).toBeGreaterThan(3994551)
      expect(result.data.cardano.currentEpoch.number).toBeGreaterThan(184)
    })
  })
}
