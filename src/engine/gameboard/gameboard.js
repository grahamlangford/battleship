import { direction, error, message } from '../constants'

export default () => {
  let gameboard
  const ships = []
  const create = (columns, rows) => {
    if (rows <= 0) {
      throw new Error(error.ROWS_POSITIVE)
    } else if (columns <= 0) {
      throw new Error(error.COLUMNS_POSITIVE)
    } else {
      gameboard = new Array(rows)
        .fill(null)
        .map(() => new Array(columns).fill(null))
    }
  }

  const getState = () => gameboard

  const allSunk = () => ships.every(ship => ship.isSunk())

  const placeShip = (ship, column, row, orientation = direction.HORIZONTAL) => {
    if (row < 0 || column < 0) {
      throw new Error(error.SHIP_IN_BOUNDS)
    } else if (orientation === direction.VERTICAL) {
      if (row + ship.getLength() > gameboard[0].length)
        throw new Error(error.SHIP_IN_BOUNDS)

      for (let i = 0; i < ship.getLength(); i += 1) {
        if (gameboard[column][row + i] != null) {
          throw new Error(error.NO_OVERLAP)
        }
      }

      for (let i = 0; i < ship.getLength(); i += 1) {
        gameboard[column][row + i] = { ship, position: i }
      }
      ships.push(ship)
    } else if (orientation === direction.HORIZONTAL) {
      if (column + ship.getLength() > gameboard.length)
        throw new Error(error.SHIP_IN_BOUNDS)

      for (let i = 0; i < ship.getLength(); i += 1) {
        if (gameboard[column + i][row] != null) {
          throw new Error(error.NO_OVERLAP)
        }
      }

      for (let i = 0; i < ship.getLength(); i += 1) {
        gameboard[column + i][row] = { ship, position: i }
      }
      ships.push(ship)
    }
  }

  const receiveAttack = (column, row, retries = 0) => {
    if (column >= gameboard.length || row >= gameboard[0].length)
      throw new Error(error.INVALID_LOCATION)
    if (!gameboard[column][row]) {
      if (retries > 0) return message.MISS
      gameboard[column][row] = 'miss'
      return message.MISS
    }
    if (gameboard[column][row] === 'miss') {
      throw new Error(error.NO_TARGET_TWICE)
    } else {
      const { ship, position } = gameboard[column][row]
      ship.hit(position)
      gameboard[column][row] = { ...gameboard[column][row], hit: 'hit' }

      if (ship.isSunk()) return message.SUNK(ship.getName())
      return message.HIT
    }
  }

  return { create, getState, allSunk, placeShip, receiveAttack }
}
