import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import gameboard from '../../engine/gameboard/gameboard'
import ship from '../../engine/ship/ship'
import Board from '../Board'
import Transition from '../Transition'

const ships1 = [
  ship('destroyer', 2),
  ship('submarine', 3),
  ship('cruiser', 3),
  ship('battleship', 4),
  ship('carrier', 5)
]
const ships2 = [
  ship('destroyer', 2),
  ship('submarine', 3),
  ship('cruiser', 3),
  ship('battleship', 4),
  ship('carrier', 5)
]

const useStyles = makeStyles({
  displayNone: {
    display: 'none'
  },
  displayBlock: {
    display: 'block'
  }
})

const game1 = gameboard()
game1.create(10, 10)
const game2 = gameboard()
game2.create(10, 10)

const App = () => {
  const classes = useStyles()

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [player, setPlayer] = useState('Player 1')
  const [turn, setTurn] = useState(-2)
  const [board, setBoard] = useState('Board 1')
  const [transition, setTransition] = useState(true)

  const togglePlayer = () =>
    player === 'Player 1' ? setPlayer('Player 2') : setPlayer('Player 1')

  const incrementTurn = () => setTurn(turn + 1)

  useEffect(() => {
    if (Object.is(turn % 2, -0) || turn % 2 === 1) {
      setBoard('Board 1')
    } else if (turn % 2 === -1 || turn % 2 === 0) {
      setBoard('Board 2')
    }
  }, [turn])

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        className={classNames({ [classes.displayNone]: !transition })}
        gutterBottom
      >
        {message.message}
      </Typography>
      <Transition
        player={player}
        onClick={() => setTransition(false)}
        display={classNames({ [classes.displayNone]: !transition })}
      />
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className={classNames({ [classes.displayNone]: transition })}
      >
        {`${player}'s Turn`}
      </Typography>
      <Board
        game={game1}
        startingShips={ships1}
        setMessage={setMessage}
        setError={setError}
        togglePlayer={togglePlayer}
        incrementTurn={incrementTurn}
        setTransition={() => setTransition(true)}
        display={classNames({
          [classes.displayNone]: transition || board !== 'Board 1'
        })}
      />
      <Board
        game={game2}
        startingShips={ships2}
        setMessage={setMessage}
        setError={setError}
        togglePlayer={togglePlayer}
        incrementTurn={incrementTurn}
        setTransition={() => setTransition(true)}
        display={classNames({
          [classes.displayNone]: transition || board !== 'Board 2'
        })}
      />
      <Typography
        variant="h4"
        align="center"
        className={classNames({ [classes.displayNone]: transition })}
        gutterBottom
      >
        {error.message}
      </Typography>
      <Typography
        variant="h1"
        align="center"
        className={classNames(classes.displayNone, {
          [classes.displayBlock]: message.message === 'All sunk!'
        })}
      >
        {`${player} is the victor!`}
      </Typography>
    </>
  )
}

export default App
