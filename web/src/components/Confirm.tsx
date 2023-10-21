import React, { FC } from 'react'

import Draggable from 'react-draggable'
import { FiSave, FiXCircle } from 'react-icons/fi'

import {
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  PaperProps,
  Slide
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

const PaperComponent: FC<PaperProps> = (props) => {
  return (
    <Draggable
      handle="#draggable-header"
      cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props}></Paper>
    </Draggable>
  )
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />
})

interface Props {
  isOpen?: boolean
  text: string
  onYes?: () => void
  onNo?: () => void
}

export const Confirm: FC<Props> = ({ isOpen, text, onYes, onNo }) => {
  return (
    <Dialog
      keepMounted
      maxWidth="sm"
      fullWidth={true}
      open={isOpen ?? false}
      TransitionComponent={Transition}
      PaperComponent={PaperComponent}>
      <DialogContent>{text}</DialogContent>
      <DialogActions
        sx={{
          px: '25px',
          pb: '25px'
        }}>
        <button className="btn-secondary" onClick={onNo}>
          <FiXCircle />
          Cancel
        </button>
        <button className="btn-primary" onClick={onYes}>
        <FiSave />
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  )
}
