import { direction, error as thrownError, message } from '../constants'

export default () => {
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const lastAttack = {}
  const setLastAttack = (x, y, result) => {
    lastAttack.x = x
    lastAttack.y = y
    lastAttack.result = result
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

  const attack = (gameboard, columns, rows) => {
    try {
      const x = getRandomInt(columns)
      const y = getRandomInt(rows)

      gameboard.receiveAttack(x, y)
    } catch (error) {
      if (thrownError.NO_TARGET_TWICE) attack(gameboard, columns, rows)
    }
  }

  const smartAttack = (gameboard, columns, rows) => {
    console.log(lastAttack)
    if (lastAttack.result === message.HIT) {
      const { x, y } = lastAttack
      if (x > 0) {
        try {
          const result = gameboard.receiveAttack(x - 1, y)
          setLastAttack(x - 1 > 0 ? x - 1 : x, y, result)
        } catch (error) {
          if (thrownError.NO_TARGET_TWICE) {
            try {
              const result = gameboard.receiveAttack(x + 1, y)
              setLastAttack(x + 1, y, result)
            } catch (error2) {
              console.log(error2)
            }
          }
        }
      } else if (lastAttack.x < columns - 2) {
        try {
          const result = gameboard.receiveAttack(x + 1, y)
          setLastAttack(x + 1, y, result)
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      try {
        const x = getRandomInt(columns)
        const y = getRandomInt(rows)
        const result = gameboard.receiveAttack(x, y)

        setLastAttack(x, y, result)
      } catch (error) {
        if (thrownError.NO_TARGET_TWICE) smartAttack(gameboard, columns, rows)
      }
    }
  }

  return { placeShip, attack, smartAttack }
}
