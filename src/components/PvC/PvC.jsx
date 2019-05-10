import React, { useReducer, useEffect } from 'react'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import pvcReducer, { actions, initialState } from '../../reducers/ai'
import computer from '../../engine/ai/ai'
import Board from '../Board'
import useStyles from './PvC.styles'

const ai = computer()

const Pvp = () => {
  const classes = useStyles()

  const [
    { message, error, player, turn, ships1, ships2, game1, game2 },
    dispatch
  ] = useReducer(pvcReducer, initialState)

  useEffect(() => {
    if (turn === -1) {
      ships1.forEach(ship => ai.placeShip(ship, game1, 10, 10))
      dispatch(actions.incrementTurn())
    } else if (turn > 0 && turn % 2 === 1) {
      ai.attack(game2, 10, 10)
      dispatch(actions.incrementTurn())
    }
  }, [turn, game1, game2, ships1])
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
        variant="h3"
        align="center"
        className={classNames(classes.marginTop, {
          [classes.displayNone]: turn > -2
        })}
      >
        Deploy Ships
      </Typography>
      <Typography
        variant="h3"
        align="center"
        className={classNames(classes.marginTop, {
          [classes.displayNone]: turn === -2
        })}
      >
        Your Board
      </Typography>
      <Typography
        variant="h4"
        align="center"
        className={classes.marginTop}
        gutterBottom
      >
        {message}
      </Typography>
      <Grid
        className={classes.root}
        spacing={0}
        container
        justify="flex-start"
        direction={turn !== -2 ? 'column' : 'column-reverse'}
      >
        <Grid item xs={12} className={classes.board}>
          <Board
            id="game-1"
            game={game1}
            isOpponent={turn > -2 && turn % 2 === 1}
            dispatch={dispatch}
            actions={actions}
            display={classNames({
              [classes.displayNone]: turn < 0
            })}
          />
        </Grid>
        <Grid item xs={12} className={classes.text}>
          <Typography variant="h4" align="center" gutterBottom>
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
              [classes.displayNone]: turn === -2
            })}
          >
            AI&apos;s Board
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.board}>
          <Board
            id="game-2"
            game={game2}
            startingShips={ships2}
            isOpponent={turn > -2}
            dispatch={dispatch}
            actions={actions}
            display={classNames({
              [classes.displayNone]: turn === -1
            })}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Pvp
