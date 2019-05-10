import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

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
      <Grid className={classes.root} spacing={0} container justify="center">
        <Grid item xs={12} className={classes.item}>
          <Button variant="contained" onClick={() => setGameType('pvp')}>
            Player vs Player
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.item}>
          <Button variant="contained" onClick={() => setGameType('ai')}>
            Player vs Computer
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

App.propTypes = {
  setGameType: PropTypes.func.isRequired
}

export default App
