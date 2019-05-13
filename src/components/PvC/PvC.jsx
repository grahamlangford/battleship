import React, {
  useReducer,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FilledInput from '@material-ui/core/FilledInput'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'

import computer from '../../engine/ai/ai'
import pvcReducer, { actions, initialState } from '../../reducers/ai'
import Board from '../Board'
import useStyles from './PvC.styles'

const ai = computer()

const PvC = ({ goHome }) => {
  const classes = useStyles()

  const [
    { difficulty, message, error, player, turn, ships1, ships2, game1, game2 },
    dispatch
  ] = useReducer(pvcReducer, initialState)

  const attack = useCallback(() => {
    switch (difficulty) {
      case 0:
        return ai.attack(game2, 10, 10)
      case 1:
        return ai.smartAttack(game2, 10, 10)
      case 2:
        return ai.cheatyAttack(game2, 10, 10, 10)
      case 3:
        return ai.smartAttack(game2, 10, 10, 5)
      default:
        return null
    }
  }, [difficulty, game2])

  useLayoutEffect(() => {
    if (/has been sunk/.test(message) && !/'s/.test(message))
      dispatch(actions.setMessage(`${player}'s ${message}`))
  }, [message, player])

  useEffect(() => {
    if (turn === -1) {
      ships1.forEach(ship => ai.placeShip(ship, game1, 10, 10))
      dispatch(actions.incrementTurn())
      dispatch(actions.togglePlayer())
    } else if (turn > 0 && turn % 2 === 1) {
      attack()
      if (game2.allSunk()) dispatch(actions.setMessage('All sunk!'))
      else {
        dispatch(actions.incrementTurn())
        dispatch(actions.togglePlayer())
      }
    }
  }, [turn, game1, game2, ships1, attack])

  return (
    <>
      <AppBar position="static">
        <ToolBar>
          <Typography variant="h6" color="inherit">
            Battleship
          </Typography>
          <div className={classes.grow} />
          <Button
            color="inherit"
            onClick={() => {
              dispatch(actions.reset())
              ai.reset()
            }}
          >
            New Game
          </Button>
          <IconButton aria-label="Home" color="inherit" onClick={goHome}>
            <HomeIcon />
          </IconButton>
        </ToolBar>
      </AppBar>

      <form
        className={classNames(classes.form, {
          [classes.displayNone]: turn > -3
        })}
      >
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="set-difficulty" variant="filled">
            Set Difficulty
          </InputLabel>
          <Select
            value={difficulty}
            onChange={e => dispatch(actions.setDifficulty(e.target.value))}
            input={<FilledInput name="difficulty" id="set-difficulty" />}
          >
            <MenuItem value={0}>Easy</MenuItem>
            <MenuItem value={1}>Hard</MenuItem>
            <MenuItem value={2}>Cheat</MenuItem>
            <MenuItem value={3}>Hard &amp; Cheat</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => dispatch(actions.incrementTurn())}
          className={classes.button}
        >
          Continue
        </Button>
      </form>

      <Typography
        variant="h3"
        align="center"
        className={classNames(classes.marginTop, {
          [classes.displayNone]: turn === -3 || turn > -2
        })}
      >
        Deploy Ships
      </Typography>
      <Typography
        variant="h3"
        align="center"
        className={classNames(classes.marginTop, {
          [classes.displayNone]: turn < 0
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
            isOpponent={
              (turn > -2 && turn % 2 === 1) || message === 'All sunk!'
            }
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
              [classes.displayNone]: turn < -1
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
              [classes.displayNone]: turn === -3 || turn === -1
            })}
          />
        </Grid>
      </Grid>
    </>
  )
}

PvC.propTypes = {
  goHome: PropTypes.func.isRequired
}

export default PvC
