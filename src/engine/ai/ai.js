import { direction, error as thrownError } from '../constants'

export default () => {
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const placeShip = (ship, gameboard, columns, rows) => {
    try {
      const orientation =
        getRandomInt(2) === 0 ? direction.VERTICAL : direction.HORIZONTAL

      const maxX =
        orientation === direction.HORIZONTAL
          ? columns - ship.getLength()
          : columns - 1
      const maxY =
        orientation === direction.VERTICAL ? rows - ship.getLength() : rows - 1
      const x = getRandomInt(maxX)
      const y = getRandomInt(maxY)

      gameboard.placeShip(ship, x, y, orientation)
    } catch (error) {
      if (thrownError.NO_OVERLAP) placeShip(ship, gameboard, columns, rows)
    }
  }

  return { placeShip }
}
