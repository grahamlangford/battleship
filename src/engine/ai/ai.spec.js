import computer from './ai'
import ship from '../ship/ship'
import gameboard from '../gameboard/gameboard'

describe('engine/ai.js', () => {
  const getShips = game => {
    const state = game.getState()
    const flattened = [].concat.apply([], state)
    return flattened.filter(el => el !== null)
  }

  const getHitsAndMisses = game => {
    return getShips(game).filter(el => el === 'miss' || el.hit === 'hit')
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

  it('ai can make an attack', () => {
    const ai = computer()
    const destroyer = ship('destroyer', 2)
    const game = gameboard()
    game.create(10, 10)

    ai.placeShip(destroyer, game, 10, 10)

    ai.attack(game, 10, 10)

    expect(getHitsAndMisses(game).length).toBe(1)
  })

  it('ai can make many attacks without attacking the same place twice', () => {
    const ai = computer()
    const ships = [
      ship('destroyer', 2),
      ship('submarine', 3),
      ship('cruiser', 3),
      ship('battleship', 4),
      ship('carrier', 5)
    ]

    const game = gameboard()
    game.create(5, 5)

    ships.forEach(ship => ai.placeShip(ship, game, 10, 10))

    for (let i = 0; i < 20; i += 1) {
      ai.attack(game, 5, 5)
    }

    expect(getHitsAndMisses(game).length).toBe(20)
  })
})
