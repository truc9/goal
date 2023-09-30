import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, PaperProps, Slide } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"
import React, { FC, ReactNode } from "react"
import Draggable from 'react-draggable'

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
    title: string
    children?: ReactNode
    onCloseClicked: () => void
    onSubmitClicked?: () => void
}

export const Popup: FC<Props> = ({
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
            <DialogTitle style={{ cursor: 'move' }} id="draggable-header">
                {title}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" disableElevation onClick={handleClose}>Close</Button>
                <Button variant="contained" color="primary" disableElevation onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

