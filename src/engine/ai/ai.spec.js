import computer from './ai'
import ship from '../ship/ship'
import gameboard from '../gameboard/gameboard'

describe('engine/ai.js', () => {
  const getShips = game => {
    const state = game.getState()
    const flattened = [].concat.apply([], state)
    return flattened.filter(el => el !== null)
  }

  it('can place a ship', () => {
    const ai = computer()
    const destroyer = ship('destroyer', 2)
    const game = gameboard()
    game.create(10, 10)

    ai.placeShip(destroyer, game, 10, 10)

    expect(getShips(game).length).toBe(2)
  })

  it('can place multiple ships without overlapping', () => {
    const ai = computer()
    const ships = [
      ship('destroyer', 2),
      ship('submarine', 3),
      ship('cruiser', 3),
      ship('battleship', 4),
      ship('carrier', 5)
    ]

    const game = gameboard()
    game.create(10, 10)

    ships.forEach(ship => ai.placeShip(ship, game, 10, 10))

    expect(getShips(game).length).toBe(17)
  })
})
