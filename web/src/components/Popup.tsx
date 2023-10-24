import React, { FC, ReactNode, useEffect } from 'react'

import Draggable from 'react-draggable'
import { FiSave, FiXCircle } from 'react-icons/fi'

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	PaperProps,
	Slide
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

const PaperComponent: FC<PaperProps> = (props) => {
	return (
		<Draggable
			handle='#draggable-header'
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
	return <Slide direction='down' ref={ref} {...props} />
})

interface Props {
	show?: boolean
	icon?: ReactNode
	title: string
	children?: ReactNode
	submitLabel?: string
	submitIcon?: ReactNode
	cancelLabel?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	onCloseClicked: () => void
	onSubmitClicked?: () => void
	showFooter?: boolean
	onShow?: () => void
}

export const Popup: FC<Props> = ({
	icon,
	title,
	show,
	submitLabel,
	submitIcon,
	cancelLabel,
	size,
	onCloseClicked,
	onSubmitClicked,
	showFooter = true,
	onShow,
	children
}) => {
	useEffect(() => {
		if (show) {
			onShow && onShow()
		}
	}, [show])

	const handleClose = () => {
		if (onCloseClicked) {
			onCloseClicked()
		}
	}

	const handleSubmit = () => {
		if (onSubmitClicked) {
			onSubmitClicked()
		}
	}

	return (
		<Dialog
			keepMounted
			maxWidth={size || 'md'}
			fullWidth={true}
			open={show ?? false}
			TransitionComponent={Transition}
			onClose={handleClose}
			PaperComponent={PaperComponent}>
			<DialogTitle
				style={{
					cursor: 'move',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '10px'
				}}
				id='draggable-header'>
				<div className='flex items-center gap-2'>
					{icon && <span>{icon}</span>}
					<span>{title}</span>
				</div>
				<button
					className='text-red-500 hover:rounded-full hover:bg-red-500 hover:text-white'
					onClick={handleClose}>
					<FiXCircle />
				</button>
			</DialogTitle>
			<DialogContent>{children}</DialogContent>
			{showFooter && (
				<DialogActions
					sx={{
						px: '25px',
						pb: '25px'
					}}>
					<button className='btn-secondary' onClick={handleClose}>
						<FiXCircle /> {cancelLabel || 'Cancel'}
					</button>
					<button className='btn-primary' onClick={handleSubmit}>
						{submitIcon || <FiSave />}
						{submitLabel || 'Submit'}
					</button>
				</DialogActions>
			)}
		</Dialog>
	)
}
