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
      if (error.message === thrownError.NO_OVERLAP)
        placeShip(ship, gameboard, columns, rows)
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
      if (error.message === thrownError.NO_TARGET_TWICE)
        attack(gameboard, columns, rows)
    }
  }

  const tryRandom = (gameboard, columns, rows) => {
    try {
      const randX = getRandomInt(columns)
      const randY = getRandomInt(rows)
      const response = gameboard.receiveAttack(randX, randY)

      setLastAttack(randX, randY, response)
    } catch (error) {
      if (error.message === thrownError.NO_TARGET_TWICE)
        tryRandom(gameboard, columns, rows)
    }
  }

  const tryDown = (gameboard, x, y) => {
    try {
      const response = gameboard.receiveAttack(x, y - 1)
      setLastAttack(x, y - 1, response, 'down')
    } catch (error) {
      if (error.message === thrownError.NO_TARGET_TWICE && y - 1 > 0) {
        try {
          tryDown(gameboard, x, y - 1)
        } catch (error2) {
          console.log('tryDown error2: ', error2)
        }
      } else {
        console.log('tryDown error1: ', error)
      }
    }
  }

  const tryUp = (gameboard, x, y) => {
    try {
      const response = gameboard.receiveAttack(x, y + 1)
      setLastAttack(x, y + 1, response, 'up')
    } catch (error) {
      if (error.message === thrownError.NO_TARGET_TWICE) {
        try {
          tryUp(gameboard, x, y + 1)
        } catch (error2) {
          console.log('tryUp error2: ', error2)
        }
      } else {
        console.log('tryUp error1: ', error)
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

  const tryLeft = (gameboard, x, y) => {
    try {
      const response = gameboard.receiveAttack(x - 1, y)
      setLastAttack(x - 1 > 0 ? x - 1 : x, y, response)
    } catch (error) {
      if (error.message === thrownError.NO_TARGET_TWICE) {
        try {
          tryRight(gameboard, x, y)
        } catch (error2) {
          if (error2.message === thrownError.NO_TARGET_TWICE) {
            tryUp(gameboard, x, y)
          } else {
            console.log('tryLeft error2: ', error2)
          }
        }
      }
    }
  }

  const smartAttack = (gameboard, columns, rows) => {
    const { x, y, result, next } = lastAttack

    console.log(result)
    if (result[result.length - 1] && /sunk/.test(result[result.length - 1])) {
      console.log('0')
      tryRandom(gameboard, columns, rows)
    } else if (result[result.length - 1] === message.HIT) {
      console.log('1')
      if (next === 'left') {
        if (x > 0) {
          console.log('1.1')
          tryLeft(gameboard, x, y)
        } else if (x < columns - 2) {
          console.log('1.2')
          tryRight(gameboard, x, y)
        }
      } else if (next === 'right' && x < columns - 1) {
        console.log('1.3')
        tryRight(gameboard, x, y)
      } else if (next === 'up' && y < rows - 1) {
        console.log('1.4')
        tryUp(gameboard, x, y)
      } else if (next === 'down' && y > 0) {
        console.log('1.5')
        tryDown(gameboard, x, y)
      }
    } else if (result[result.length - 2] === message.HIT) {
      console.log('2')
      if (x < columns - 2 && next === 'left') {
        console.log('2.1')
        tryRight(gameboard, x, y)
      } else if (y < rows - 1 && next === 'right') {
        console.log('2.2')
        tryUp(gameboard, x - 1, y)
      } else if (y < rows - 1 && next === 'up') {
        console.log('2.3')
        tryDown(gameboard, x, y)
      } else {
        console.log('2.4')
        tryRandom(gameboard, columns, rows)
      }
    } else if (result[result.length - 3] === message.HIT) {
      console.log('3')
      if (/sunk/.test(result[result.length - 2])) {
        console.log('3.0')
        tryRandom(gameboard, columns, rows)
      } else if (next === 'left') {
        console.log('3.1')
        tryRight(gameboard, x, y)
      } else if (next === 'right') {
        console.log('3.2')
        tryUp(gameboard, x - 1, y)
      } else if (next === 'up') {
        console.log('3.3')
        tryDown(gameboard, x, y)
      } else {
        console.log('3.4', next)
      }
    } else if (result[result.length - 4] === message.HIT) {
      console.log('4')
      if (
        /sunk/.test(result[result.length - 2]) ||
        /sunk/.test(result[result.length - 3])
      ) {
        console.log('4.0')
        tryRandom(gameboard, columns, rows)
      } else if (next === 'up') {
        console.log('4.1')
        tryDown(gameboard, x, y - 1)
      } else {
        console.log('4.2', next)
      }
    } else {
      console.log('5')
      tryRandom(gameboard, columns, rows)
    }

    console.log(lastAttack.result[lastAttack.result.length - 1])
  }

  return { placeShip, testAttack, attack, smartAttack }
}
