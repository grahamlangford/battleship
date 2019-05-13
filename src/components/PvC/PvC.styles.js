import { makeStyles } from '@material-ui/styles'

export default makeStyles({
  displayNone: {
    display: 'none !important'
  },
  displayBlock: {
    display: 'block !important'
  },
  root: {
    width: '100%'
  },
  board: {
    flex: '2 1 auto',
    width: '100%'
  },
  text: {
    flex: '1 1 auto',
    with: '100%'
  },
  marginTop: {
    marginTop: 32
  },
  grow: {
    flexGrow: 1
  },
  form: {
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  formControl: {
    margin: 8,
    minWidth: 180
  },
  button: {
    margin: 16,
    display: 'block'
  }
})
