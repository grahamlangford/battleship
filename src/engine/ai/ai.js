import { direction, error as thrownError, message } from '../constants'

export default () => {
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const lastAttack = { x: -1, y: -1, result: [], next: 'left' }
  const setLastAttack = (x, y, result, next = 'left') => {
    lastAttack.x = x
    lastAttack.y = y
    lastAttack.result = [...lastAttack.result, result]
    lastAttack.next = next
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

  const testAttack = (gameboard, x, y) => {
    const result = gameboard.receiveAttack(x, y)
    setLastAttack(x, y, result)
  }

  const attack = (gameboard, columns, rows) => {
    try {
      const x = getRandomInt(columns)
      const y = getRandomInt(rows)

      gameboard.receiveAttack(x, y)
    } catch (error) {
      if (thrownError.NO_TARGET_TWICE) attack(gameboard, columns, rows)
    }
  }

  const tryRandom = (gameboard, columns, rows, smartAttack) => {
    try {
      const randX = getRandomInt(columns)
      const randY = getRandomInt(rows)
      const response = gameboard.receiveAttack(randX, randY)

      setLastAttack(randX, randY, response)
    } catch (error) {
      if (thrownError.NO_TARGET_TWICE) smartAttack(gameboard, columns, rows)
    }
  }

  const tryLeft = (gameboard, x, y) => {
    try {
      const response = gameboard.receiveAttack(x - 1, y)
      setLastAttack(x - 1 > 0 ? x - 1 : x, y, response)
    } catch (error) {
      if (thrownError.NO_TARGET_TWICE) {
        try {
          const response = gameboard.receiveAttack(x + 1, y)
          setLastAttack(x + 1, y, response, 'right')
        } catch (error2) {
          console.log(error2)
        }
      }
    }
  }

  const tryRight = (gameboard, x, y) => {
    try {
      const response = gameboard.receiveAttack(x + 1, y)
      setLastAttack(x + 1, y, response, 'right')
    } catch (error) {
      if (error.message === thrownError.NO_TARGET_TWICE)
        tryRight(gameboard, x + 1, y)
      else {
        console.log(error)
      }
    }
  }

  const smartAttack = (gameboard, columns, rows) => {
    const { x, y, result, next } = lastAttack

    if (result[result.length - 1] === message.HIT && next === 'left') {
      if (x > 0) {
        tryLeft(gameboard, x, y)
      } else if (x < columns - 2) {
        tryRight(gameboard, x, y)
      }
    } else if (
      result[result.length - 1] === message.MISS &&
      result[result.length - 2] === message.HIT
    ) {
      if (x < columns - 2 && next === 'left') {
        tryRight(gameboard, x, y)
      }
    } else if (next === 'right') {
      tryRight(gameboard, x, y)
    } else {
      tryRandom(gameboard, columns, rows, smartAttack)
    }
  }

  return { placeShip, testAttack, attack, smartAttack }
}
