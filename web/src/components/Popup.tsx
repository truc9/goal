import React, {
    FC,
    ReactNode,
} from 'react'

import Draggable from 'react-draggable'
import {
    FiSave,
    FiXCircle,
} from 'react-icons/fi'

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    PaperProps,
    Slide,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

const PaperComponent: FC<PaperProps> = (props) => {
    return (
        <Draggable
            handle="#draggable-header"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props}></Paper>
        </Draggable>
    )
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />
})

interface Props {
    isOpen?: boolean
    icon?: ReactNode
    title: string
    children?: ReactNode
    onCloseClicked: () => void
    onSubmitClicked?: () => void
}

export const Popup: FC<Props> = ({
    icon,
    title,
    isOpen,
    onCloseClicked,
    onSubmitClicked,
    children,
}) => {
    const handleClose = () => {
        console.log("Popup closed")
        if (onCloseClicked) {
            onCloseClicked()
        }
    }

    const handleSubmit = () => {
        console.log("Popup submited")
        if (onSubmitClicked) {
            onSubmitClicked()
        }
    }

    return (
        <Dialog
            keepMounted
            maxWidth="sm"
            fullWidth={true}
            open={isOpen ?? false}
            TransitionComponent={Transition}
            onClose={handleClose}
            PaperComponent={PaperComponent}
        >
            <DialogTitle style={{
                cursor: 'move',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }} id="draggable-header">
                <span>{icon}</span>{title}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions sx={{
                px: "25px",
                pb: "25px"
            }}>
                <button className='btn-secondary' onClick={handleClose}><FiXCircle /> Close</button>
                <button className='btn-primary' onClick={handleSubmit}><FiSave />Submit</button>
            </DialogActions>
        </Dialog>
    )
}

