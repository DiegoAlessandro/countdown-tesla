import React from 'react'
import * as MaterialUI from '@material-ui/core'
import carImageWhite from '/static/model3_white.jpeg'
import carImageBlack from '/static/model3_black.jpeg'
import carImageGray from '/static/model3_gray.jpeg'
import carImageBlue from '/static/model3_blue.jpeg'
import carImageRed from '/static/model3_red.jpeg'
import paintWhiteImg from '/static/Paint_White.png'
import paintBlackImg from '/static/Paint_Black.png'
import paintGrayImg from '/static/Paint_MidnightSilver.png'
import paintBlueImg from '/static/Paint_Blue.png'
import paintRedImg from '/static/Paint_Red.png'
import SettingsIcon from '@material-ui/icons/Settings'
import { Avatar, Button, ButtonGroup } from '@material-ui/core'
const useStyles = MaterialUI.makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  modalPaper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
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
    paddingTop: '56.25%',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  buttonBorder: { border: '0px' },
}))

const App = () => {
  /** 納車日*/
  const [deliveryDateTime, setDeliveryDateTime] = React.useState(new Date())
  const [nowTime, setNowTime] = React.useState(new Date())
  const displayDateMeta = React.useMemo(() => {
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

  const refreshNowTime = React.useCallback(() => {
    setNowTime(new Date())
  }, [setNowTime])
  /** モーダル*/
  const getModalStyle = () => {
    const top = 50
    const left = 50

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    }
  }
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [modalStyle] = React.useState(getModalStyle)
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  /** 色選択ボタン */
  enum CarColor {
    white,
    black,
    gray,
    blue,
    red,
  }
  const [carColor, setCarColor] = React.useState<CarColor>(CarColor.white)
  const onClickColorButton = React.useCallback(
    (newCarColor: CarColor) => () => {
      localStorage.setItem('carColor', newCarColor.toString())
      setCarColor(newCarColor)
    },
    [carColor, setCarColor]
  )

  const switchCarImage = React.useCallback(() => {
    switch (carColor) {
      case CarColor.white:
        return carImageWhite
      case CarColor.black:
        return carImageBlack
      case CarColor.gray:
        return carImageGray
      case CarColor.blue:
        return carImageBlue
      case CarColor.red:
        return carImageRed
      default:
        return carImageWhite
    }
  }, [carColor])

  /** ローカルストレージ */
  const setLocalDeliveryDateTime = React.useCallback(
    (e) => {
      if (!e.target.value) return
      localStorage.setItem('deliveryDateTime', e.target.value)
      setDeliveryDateTime(new Date(e.target.value))
      setInterval(refreshNowTime, 1000)
    },
    [setDeliveryDateTime]
  )

  const getDeliveryDateTime = React.useCallback(() => {
    /** 納車日の取得*/
    const localDeliveryDateTime = localStorage.getItem('deliveryDateTime')
    if (localDeliveryDateTime == null) {
      return false
    }
    return localDeliveryDateTime
  }, [])

  const getCarColor = React.useCallback(() => {
    /** 色の取得*/
    const localCarColor = localStorage.getItem('carColor')
    if (localCarColor == null) {
      return false
    }

    return localCarColor
  }, [])

  React.useEffect(() => {
    let localCarColor = getCarColor()
    if (localCarColor) {
      setCarColor(Number(localCarColor))
    }
  }, [carColor, setCarColor])

  React.useEffect(() => {
    setDeliveryDateTime(deliveryDateTime)
  }, [deliveryDateTime])

  React.useEffect(() => {
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
      <MaterialUI.CssBaseline />
      <MaterialUI.Container fixed>
        <div className={classes.root}>
          <MaterialUI.Grid container spacing={3}>
            <MaterialUI.Grid item xs={12}>
              <MaterialUI.Paper className={classes.paper}>
                <MaterialUI.CardMedia
                  image={switchCarImage()}
                  className={classes.media}
                />
                <div>
                  {deliveryDateTime
                    ? `納車日は ${deliveryDateTime.toString()}`
                    : null}
                </div>
                <div>
                  {deliveryDateTime
                    ? `納車まで：${displayDateMeta.days}日 ${displayDateMeta.h}時間 ${displayDateMeta.m}分 ${displayDateMeta.s}秒`
                    : null}
                  <MaterialUI.IconButton
                    aria-label="delete"
                    className={classes.margin}
                    onClick={handleOpen}
                    size="small"
                  >
                    <SettingsIcon fontSize="inherit" />
                  </MaterialUI.IconButton>
                </div>
              </MaterialUI.Paper>
            </MaterialUI.Grid>
          </MaterialUI.Grid>
          <MaterialUI.Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.modalPaper}>
              <h2 id="simple-modal-title">納車日を入力</h2>
              <form className={classes.container} noValidate>
                <MaterialUI.TextField
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
              <div>
                <h2>色</h2>
                <ButtonGroup
                  size="small"
                  aria-label="small outlined button group"
                >
                  <Button
                    startIcon={<Avatar src={paintWhiteImg} />}
                    className={classes.buttonBorder}
                    onClick={onClickColorButton(CarColor.white)}
                    value={'white'}
                  />
                  <Button
                    startIcon={<Avatar src={paintBlackImg} />}
                    className={classes.buttonBorder}
                    onClick={onClickColorButton(CarColor.black)}
                    value={'black'}
                  />
                  <Button
                    startIcon={<Avatar src={paintGrayImg} />}
                    className={classes.buttonBorder}
                    onClick={onClickColorButton(CarColor.gray)}
                    value={'gray'}
                  />
                  <Button
                    startIcon={<Avatar src={paintBlueImg} />}
                    className={classes.buttonBorder}
                    onClick={onClickColorButton(CarColor.blue)}
                    value={'blue'}
                  />
                  <Button
                    startIcon={<Avatar src={paintRedImg} />}
                    className={classes.buttonBorder}
                    onClick={onClickColorButton(CarColor.red)}
                    value={'red'}
                  />
                </ButtonGroup>
              </div>
            </div>
          </MaterialUI.Modal>
        </div>
      </MaterialUI.Container>
    </>
  )
}

export default App
