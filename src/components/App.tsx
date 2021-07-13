import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
import carImage from '/static/model3_white.jpeg'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}))

const App = () => {
  const [deliveryDateTime] = useState(new Date('2021-08-03T18:30:00+0900'))
  const [nowTime, setNowTime] = useState(new Date())

  /** モーダル*/
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [modalStyle] = React.useState(getModalStyle)
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const { days, h, m, s } = useMemo(() => {
    let diffMilliSeconds = deliveryDateTime.getTime() - nowTime.getTime()
    let days = Math.trunc(diffMilliSeconds / (1000 * 60 * 60) / 24)
    diffMilliSeconds = diffMilliSeconds - days * 1000 * 60 * 60 * 24
    let h = Math.trunc(diffMilliSeconds / (1000 * 60 * 60))
    diffMilliSeconds = diffMilliSeconds - h * 1000 * 60 * 60
    let m = Math.trunc(diffMilliSeconds / (1000 * 60))
    diffMilliSeconds = diffMilliSeconds - m * 1000 * 60
    let s = Math.trunc(diffMilliSeconds / 1000)
    return { days, h, m, s }
  }, [deliveryDateTime, nowTime])

  const refreshNotTime = useCallback(() => {
    setNowTime(new Date())
  }, [setNowTime])

  /** ローカルストレージ */
  const setDeliveryDateTime = useCallback((e) => {
    localStorage.setItem('deliveryDateTime', e.target.value)
  }, [])

  const getDeliveryDateTime = useCallback(() => {
    const localDeliveryDateTime = localStorage.getItem('deliveryDateTime')
    if (localDeliveryDateTime == null) {
      return false
    }
    return localDeliveryDateTime
  }, [])

  useEffect(() => {
    if (getDeliveryDateTime()) {
      setInterval(refreshNotTime, 1000)
      return
    }
    setOpen(true)
  }, [refreshNotTime])

  return (
    <>
      <CssBaseline />
      <Container fixed>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CardMedia image={carImage} className={classes.media} />
              <Paper
                className={classes.paper}
              >{`納車日まで：${days}日 ${h}時間 ${m}分 ${s}秒`}</Paper>
            </Grid>
          </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.paper}>
              <h2 id="simple-modal-title">納車日を入力</h2>
              <form className={classes.container} noValidate>
                <TextField
                  id="datetime-local"
                  label="納車日"
                  type="datetime-local"
                  onChange={setDeliveryDateTime}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </div>
          </Modal>
        </div>
      </Container>
    </>
  )
}

export default App
