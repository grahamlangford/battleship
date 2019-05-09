import constants from '../constants'

export default () => {
  let gameboard
  const ships = []
  const create = (columns, rows) => {
    if (rows <= 0) {
      throw new Error('Rows must be a positive integer!')
    } else if (columns <= 0) {
      throw new Error('Columns must be a positive integer!')
    } else {
      gameboard = new Array(rows)
        .fill(null)
        .map(() => new Array(columns).fill(null))
    }
  }

  const getState = () => gameboard

  const allSunk = () => ships.every(ship => ship.isSunk())

  const placeShip = (ship, column, row, direction = constants.HORIZONTAL) => {
    if (row < 0 || column < 0) {
      throw new Error('Ship must be placed in bounds!')
    } else if (direction === constants.VERTICAL) {
      if (row + ship.getLength() > gameboard[0].length)
        throw new Error('Ship must be placed in bounds!')

      for (let i = 0; i < ship.getLength(); i += 1) {
        if (gameboard[column][row + i] != null) {
          throw new Error('Ships cannot overlap!')
        }
      }

      for (let i = 0; i < ship.getLength(); i += 1) {
        gameboard[column][row + i] = { ship, position: i }
      }
      ships.push(ship)
    } else if (direction === constants.HORIZONTAL) {
      if (column + ship.getLength() > gameboard.length)
        throw new Error('Ship must be placed in bounds!')

      for (let i = 0; i < ship.getLength(); i += 1) {
        if (gameboard[column + i][row] != null) {
          throw new Error('Ships cannot overlap!')
        }
      }

      for (let i = 0; i < ship.getLength(); i += 1) {
        gameboard[column + i][row] = { ship, position: i }
      }
      ships.push(ship)
    }
  }

  const receiveAttack = (column, row) => {
    if (!gameboard[column][row]) {
      gameboard[column][row] = 'miss'
      return 'Miss!'
    }
    if (gameboard[column][row] === 'miss') {
      throw new Error('Cannot target same place twice!')
    } else {
      const { ship, position } = gameboard[column][row]
      ship.hit(position)
      gameboard[column][row] = { ...gameboard[column][row], hit: 'hit' }

      if (ship.isSunk()) return `The ${ship.getName()} has been sunk!`
      return 'Hit!'
    }
  }

  return { create, getState, allSunk, placeShip, receiveAttack }
}
