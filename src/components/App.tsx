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
  modalPaper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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
  // const [deliveryDateTime] = useState(new Date('2021-08-03T18:30:00+0900'))
  const [deliveryDateTime, setDeliveryDateTime] = useState(new Date())
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

  const displayDateMeta = useMemo(() => {
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

  const refreshNowTime = useCallback(() => {
    setNowTime(new Date())
  }, [setNowTime])

  /** ローカルストレージ */
  const setLocalDeliveryDateTime = useCallback(
    (e) => {
      localStorage.setItem('deliveryDateTime', e.target.value)
      setDeliveryDateTime(new Date(e.target.value))
      setInterval(refreshNowTime, 1000)
    },
    [setDeliveryDateTime]
  )

  const getDeliveryDateTime = useCallback(() => {
    const localDeliveryDateTime = localStorage.getItem('deliveryDateTime')
    if (localDeliveryDateTime == null) {
      return false
    }
    return localDeliveryDateTime
  }, [])

  useEffect(() => {
    setDeliveryDateTime(deliveryDateTime)
  }, [deliveryDateTime])

  useEffect(() => {
    let deliveryLocalDate = getDeliveryDateTime()
    if (deliveryLocalDate) {
      setDeliveryDateTime(new Date(deliveryLocalDate))
      setInterval(refreshNowTime, 1000)
      return
    }
    setOpen(true)
  }, [setDeliveryDateTime])

  return (
    <>
      <CssBaseline />
      <Container fixed>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CardMedia image={carImage} className={classes.media} />
              <Paper className={classes.paper}>
                {deliveryDateTime
                  ? `納車まで：${displayDateMeta.days}日 ${displayDateMeta.h}時間 ${displayDateMeta.m}分 ${displayDateMeta.s}秒`
                  : null}
              </Paper>
            </Grid>
          </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.modalPaper}>
              <h2 id="simple-modal-title">納車日を入力</h2>
              <form className={classes.container} noValidate>
                <TextField
                  id="datetime-local"
                  label="納車日"
                  type="datetime-local"
                  onChange={setLocalDeliveryDateTime}
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
