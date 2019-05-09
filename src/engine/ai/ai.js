import constants from '../constants'

export default () => {
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const placeShip = (ship, gameboard, columns, rows) => {
    try {
      const direction =
        getRandomInt(2) === 0 ? constants.VERTICAL : constants.HORIZONTAL

      const maxX =
        direction === constants.HORIZONTAL
          ? columns - ship.getLength()
          : columns - 1
      const maxY =
        direction === constants.VERTICAL ? rows - ship.getLength() : rows - 1
      const x = getRandomInt(maxX)
      const y = getRandomInt(maxY)

      gameboard.placeShip(ship, x, y, direction)
    } catch (error) {
      placeShip(ship, gameboard, columns, rows)
    }
  }

  return { placeShip }
}
