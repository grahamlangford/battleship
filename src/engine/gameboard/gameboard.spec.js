import gameboard from './gameboard'
import ship from '../ship/ship'
import { direction } from '../constants'

describe('engine/gameboard.js', () => {
  it('creates a gameboard with rows: 8 and columns: 8', () => {
    const game = gameboard()
    game.create(8, 8)
    const testGameboard = new Array(8)
      .fill(null)
      .map(() => new Array(8).fill(null))
    expect(game.getState()).toEqual(testGameboard)
  })

  it('throws an error if rows or columns is not a positive integer', () => {
    const game = gameboard()
    expect(() => game.create(5, -1)).toThrow('Rows must be a positive integer!')
    expect(() => game.create(0, 5)).toThrow(
      'Columns must be a positive integer!'
    )
  })

  it('allSunk returns true when there are no ships on the board', () => {
    const game = gameboard()
    expect(game.allSunk()).toBe(true)
  })

  it('allSunk returns false whenever any ships are still on the board', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 1, 1)
    expect(game.allSunk()).toBe(false)
  })

  it('allSunk returns true when all ships on the board have been sunk', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 1, 1)
    game.receiveAttack(1, 1)
    game.receiveAttack(2, 1)

    expect(game.allSunk()).toBe(true)
  })

  it('placeShip places a ship at the given coordinates, horizontally by default', () => {
    const game = gameboard()
    game.create(2, 3)
    const cruiser = ship('cruiser', 3)

    game.placeShip(cruiser, 0, 0)
    const state = [
      [{ ship: cruiser, position: 0 }, null],
      [{ ship: cruiser, position: 1 }, null],
      [{ ship: cruiser, position: 2 }, null]
    ]

    expect(game.getState()).toEqual(state)
  })

  it('placeShip places a ship at the given coordinates, vertically if specified', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 1, 1, direction.VERTICAL)
    const state = [
      [null, null, null],
      [
        null,
        { ship: destroyer, position: 0 },
        { ship: destroyer, position: 1 }
      ],
      [null, null, null]
    ]

    expect(game.getState()).toEqual(state)
  })

  it('throws an error when trying to place a ship out of bounds', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    expect(() => game.placeShip(destroyer, -1, 1)).toThrow(
      'Ship must be placed in bounds!'
    )
    expect(() => game.placeShip(destroyer, 1, -1)).toThrow(
      'Ship must be placed in bounds!'
    )
    expect(() => game.placeShip(destroyer, 2, 1)).toThrow(
      'Ship must be placed in bounds!'
    )
    expect(() => game.placeShip(destroyer, 1, 2, direction.VERTICAL)).toThrow(
      'Ship must be placed in bounds!'
    )
  })

  it('throws an error if a new ship will overlap another', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)
    const cruiser = ship('cruiser', 3)

    game.placeShip(destroyer, 0, 1)

    expect(() => game.placeShip(cruiser, 1, 0, direction.VERTICAL)).toThrow(
      'Ships cannot overlap!'
    )

    expect(() => game.placeShip(cruiser, 0, 1)).toThrow('Ships cannot overlap!')
  })

  it('receiveAttack returns "Hit!" when a ship is hit', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 0, 1)
    expect(game.receiveAttack(1, 1)).toBe('Hit!')
  })

  it('receiveAttack returns "Miss!" when no ship is hit', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 0, 1)
    expect(game.receiveAttack(0, 0)).toBe('Miss!')
  })

  it('receiveAttack returns a message when a ship sinks', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 0, 1)

    game.receiveAttack(0, 1)
    expect(game.receiveAttack(1, 1)).toBe('The destroyer has been sunk!')
  })

  it('cannot attack the same place twice', () => {
    const game = gameboard()
    game.create(3, 3)
    const destroyer = ship('destroyer', 2)

    game.placeShip(destroyer, 0, 1)

    game.receiveAttack(0, 1)
    expect(() => game.receiveAttack(0, 1)).toThrow(
      'Cannot target same place twice!'
    )

    game.receiveAttack(2, 2)
    expect(() => game.receiveAttack(2, 2)).toThrow(
      'Cannot target same place twice!'
    )
  })
})
