import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  button: {
    display: 'block'
  }
})

const Transition = ({ player, onClick, display }) => {
  const classes = useStyles()
  return (
    <div className={classNames(display, classes.root)}>
      <Typography variant="h3" align="center">{`${player}'s Turn`}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        className={classes.button}
      >
        Continue
      </Button>
    </div>
  )
}

Transition.propTypes = {
  player: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  display: PropTypes.string.isRequired
}

export default Transition
