import React, { useReducer, useEffect } from 'react'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import pvpReducer, { actions, initialState } from '../../reducers/pvp'
import Board from '../Board'
import Transition from '../Transition'
import useStyles from './App.styles'

const App = () => {
  const classes = useStyles()

  const [
    {
      message,
      error,
      player,
      turn,
      board,
      transition,
      ships1,
      ships2,
      game1,
      game2
    },
    dispatch
  ] = useReducer(pvpReducer, initialState)

  useEffect(() => {
    if (Object.is(turn % 2, -0) || turn % 2 === 1) {
      dispatch(actions.setBoard('Board 1'))
    } else if (turn % 2 === -1 || turn % 2 === 0) {
      dispatch(actions.setBoard('Board 2'))
    }
  }, [turn])

  return (
    <>
      <AppBar position="static">
        <ToolBar>
          <Typography variant="h6" color="inherit">
            Battleship
          </Typography>
          <div className={classes.grow} />
          <Button color="inherit" onClick={() => dispatch(actions.reset())}>
            New Game
          </Button>
        </ToolBar>
      </AppBar>
      <Typography
        variant="h4"
        align="center"
        className={classNames(classes.marginTop, {
          [classes.displayNone]: !transition
        })}
        gutterBottom
      >
        {message}
      </Typography>
      <Transition
        player={player}
        onClick={() => dispatch(actions.toggleTransition())}
        display={classNames({ [classes.displayNone]: !transition })}
      />
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className={classNames(classes.marginTop, {
          [classes.displayNone]: transition
        })}
      >
        {`${player}'s Turn`}
      </Typography>
      <Grid
        className={classes.root}
        spacing={0}
        container
        justify="flex-start"
        direction={board === 'Board 1' ? 'column' : 'column-reverse'}
      >
        <Grid item xs={12} className={classes.board}>
          <Board
            game={game1}
            startingShips={ships1}
            isOpponent={board === 'Board 2'}
            dispatch={dispatch}
            toggleTransition={() => dispatch(actions.toggleTransition())}
            display={classNames({
              [classes.displayNone]: transition || turn === -1
            })}
          />
        </Grid>
        <Grid item xs={12} className={classes.text}>
          <Typography
            variant="h4"
            align="center"
            className={classNames({ [classes.displayNone]: transition })}
            gutterBottom
          >
            {error}
          </Typography>
          <Typography
            variant="h1"
            align="center"
            className={classNames(classes.displayNone, {
              [classes.displayBlock]: message === 'All sunk!'
            })}
          >
            {`${player} is the victor!`}
          </Typography>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            className={classNames({
              [classes.displayNone]: transition || turn < 0
            })}
          >
            Opponent&apos;s Board
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.board}>
          <Board
            game={game2}
            startingShips={ships2}
            isOpponent={board === 'Board 1'}
            dispatch={dispatch}
            display={classNames({
              [classes.displayNone]: transition || turn === -2
            })}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default App
