import computer from './ai'
import ship from '../ship/ship'
import gameboard from '../gameboard/gameboard'
import { direction } from '../constants'

describe('engine/ai.js', () => {
  const getShips = game => {
    const state = game.getState()
    const flattened = [].concat.apply([], state)
    return flattened.filter(el => el !== null)
  }

  const getHitsAndMisses = game => {
    return getShips(game).filter(el => el === 'miss' || el.hit === 'hit')
  }

  const getHits = game => {
    return getShips(game).filter(el => el.hit === 'hit')
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

  it('testAttack attacks specified coordinates', () => {
    const ai = computer()
    const destroyer = ship('destroyer', 2)
    const game = gameboard()
    game.create(10, 10)

    game.placeShip(destroyer, 0, 0)

    ai.testAttack(game, 0, 0)

    expect(getHitsAndMisses(game).length).toBe(1)
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

  it('ai can make "smart" attacks', () => {
    const ai = computer()
    const destroyer = ship('destroyer', 2)
    const game = gameboard()
    game.create(10, 10)

    ai.placeShip(destroyer, game, 10, 10)

    ai.smartAttack(game, 10, 10)

    expect(getHitsAndMisses(game).length).toBe(1)
  })

  it('ai first tries to attack left if possible, right if not when it scores a hit', () => {
    const ai = computer()
    const carrier = ship('carrier', 5)
    const game = gameboard()
    game.create(10, 10)

    game.placeShip(carrier, 0, 0)

    ai.testAttack(game, 1, 0)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)

    expect(getHits(game).length).toBe(5)
  })

  it('ai remembers multiple attacks so it can switch directions if it gets a miss without a sunk', () => {
    const ai = computer()
    const carrier = ship('carrier', 5)
    const game = gameboard()
    game.create(10, 10)

    game.placeShip(carrier, 5, 0)

    ai.testAttack(game, 5, 0)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)

    expect(getHits(game).length).toBe(5)
  })

  it('ai switches to up (increasing y) when neither left nor right is working', () => {
    const ai = computer()
    const carrier = ship('carrier', 5)
    const game = gameboard()
    game.create(10, 10)

    game.placeShip(carrier, 1, 1, direction.VERTICAL)

    ai.testAttack(game, 1, 1)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)

    expect(getHits(game).length).toBe(5)
  })

  it('ai switches to down (decreasing y) when nothing else works', () => {
    const ai = computer()
    const carrier = ship('carrier', 5)
    const game = gameboard()
    game.create(10, 10)

    game.placeShip(carrier, 1, 1, direction.VERTICAL)

    ai.testAttack(game, 1, 5)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)
    ai.smartAttack(game, 10, 10)

    expect(getHits(game).length).toBe(5)
  })

  it('ai can make "cheaty" attacks', () => {
    const ai = computer()
    const destroyer = ship('destroyer', 2)
    const game = gameboard()
    game.create(10, 10)

    ai.placeShip(destroyer, game, 10, 10)

    ai.cheatyAttack(game, 10, 10, 5)

    expect(getHitsAndMisses(game).length).toBe(1)
  })
})
