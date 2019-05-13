import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import useStyles from './App.styles'

const App = ({ setGameType }) => {
  const classes = useStyles()

  return (
    <>
      <AppBar position="static">
        <ToolBar>
          <Typography variant="h6" color="inherit">
            Battleship
          </Typography>
        </ToolBar>
      </AppBar>
      <div className={classes.root}>
        <Button
          variant="contained"
          onClick={() => setGameType({ type: 'pvp' })}
          className={classes.button}
        >
          Player vs Player
        </Button>
        <Button
          variant="contained"
          onClick={() => setGameType({ type: 'ai' })}
          className={classes.button}
        >
          Player vs Computer
        </Button>
      </div>
    </>
  )
}

App.propTypes = {
  setGameType: PropTypes.func.isRequired
}

export default App
