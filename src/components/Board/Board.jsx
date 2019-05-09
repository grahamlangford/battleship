import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import classNames from 'classnames'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import constants from '../../engine/constants'
import useStyles from './Board.styles'

const Board = ({
  game,
  startingShips,
  isOpponent,
  dispatch,
  actions,
  display
}) => {
  const classes = useStyles()
  const [selectedShip, setSelectedShip] = useState(null)
  const [isVertical, setIsVertical] = useState(false)
  const [ships, setShips] = useState(startingShips)

  useEffect(() => setShips(startingShips), [startingShips])

  const handleCardClick = (x, y) => {
    if (ships.length > 0 && selectedShip) {
      try {
        game.placeShip(
          selectedShip,
          x,
          y,
          isVertical ? constants.VERTICAL : constants.HORIZONTAL
        )

        const newShips = ships.filter(
          boat => boat.getName() !== selectedShip.getName()
        )
        if (newShips.length === 0) {
          dispatch(actions.togglePlayer())
          dispatch(actions.incrementTurn())
          dispatch(actions.toggleTransition())
        }

        setShips(newShips)
        setSelectedShip(null)
        dispatch(actions.setError(''))
      } catch (error) {
        dispatch(actions.setError(error.message))
      }
    } else if (ships.length === 0) {
      try {
        const newMessage = game.receiveAttack(x, y)
        dispatch(actions.setMessage(game.allSunk() ? 'All sunk!' : newMessage))
        dispatch(actions.setError(''))
        if (!game.allSunk()) {
          dispatch(actions.togglePlayer())
          dispatch(actions.incrementTurn())
          dispatch(actions.toggleTransition())
        }
      } catch (error) {
        dispatch(actions.setError(error.message))
      }
    }
  }

  return (
    <div className={classNames(display, classes.board)}>
      <Grid container justify="center" spacing={40}>
        <Grid item xs={12} sm={8} md={6}>
          <Grid container justify="center" spacing={0}>
            {game.getState().map((column, x) => (
              <Grid item key={shortid.generate()}>
                {column.map((location, y) => (
                  <Card
                    key={shortid.generate()}
                    className={classNames(classes.card, {
                      [classes.cardNull]: location === null,
                      [classes.cardPlaced]:
                        location && location.ship && ships.length > 0,
                      [classes.cardHit]: location && location.hit,
                      [classes.cardMiss]: location === 'miss'
                    })}
                    onClick={() =>
                      isOpponent ? () => {} : handleCardClick(x, y)
                    }
                  />
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>

        {ships.length > 0 && (
          <Grid item xs={12} sm={4}>
            <Grid container justify="center" spacing={8}>
              {ships.map(boat => (
                <Grid item key={shortid.generate()}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setSelectedShip(boat)}
                    className={classes.button}
                  >
                    {boat.getName()}
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <FormControlLabel
                  className={classes.formControl}
                  label="Rotate"
                  control={(
                    <Checkbox
                      checked={isVertical}
                      onChange={() => setIsVertical(!isVertical)}
                      value="isVertical"
                      color="primary"
                    />
)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

Board.propTypes = {
  game: PropTypes.object.isRequired,
  startingShips: PropTypes.array.isRequired,
  isOpponent: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  display: PropTypes.string.isRequired
}

export default Board
