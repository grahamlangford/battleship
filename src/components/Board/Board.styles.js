import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => {
  return {
    formControl: {
      margin: 4,
      marginLeft: 16,
      marginRight: 16,
      minWidth: 140
    },
    card: {
      minWidth: 32,
      minHeight: 32,
      maxWidth: 48,
      margin: 0,
      border: '1px solid',
      borderRadius: 0,
      borderColor: theme.palette ? theme.palette.primary.dark : '#ffffff'
    },
    cardNull: {
      backgroundColor: theme.palette
        ? theme.palette.background.paper
        : '#ffffff'
    },
    cardPlaced: {
      backgroundColor: theme.palette ? theme.palette.grey[500] : '#ffffff'
    },
    cardHit: {
      backgroundColor: theme.palette ? theme.palette.error.main : '#ffffff'
    },
    cardMiss: {
      backgroundColor: '#000'
    },
    button: {
      margin: 4,
      marginLeft: 16,
      marginRight: 16,
      minWidth: 140
    }
  }
})
