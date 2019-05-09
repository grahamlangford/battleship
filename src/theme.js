import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

export default createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: blue[100],
      paper: blue[500]
    },
    primary: {
      main: blue[900]
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: 16
  }
})
