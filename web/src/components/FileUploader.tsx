import { FC, useEffect, useRef, useState } from 'react'
import { FiFile } from 'react-icons/fi'

interface Props {
	onChange: (files: File[]) => void
	multiple?: boolean
}

export const FileUploader: FC<Props> = ({ onChange, multiple }) => {
	const ref = useRef<any>(null!)
	const [fileNames, setFileNames] = useState('')

	useEffect(() => {
		return () => {
			ref.current = null
		}
	}, [])

	const browseFile = () => {
		ref.current.click()
	}

	const handleChange = (e: any) => {
		const hasFile = e.target.files && e.target.files[0]
		if (!hasFile) return
		if (!multiple) {
			setFileNames(e.target.files[0].name)
		} else {
			setFileNames(
				e.target.files.reduce(
					(prev: any, cur: any) => `${prev.name}, ${cur.name}`
				)
			)
		}
		onChange(e.target.files)
	}

	return (
		<div className='tw-flex tw-items-center tw-gap-2'>
			<input
				value={fileNames}
				className='tw-w-full tw-rounded tw-bg-slate-100 tw-px-4 tw-py-2'
				placeholder='Browse CSV file...'
				readOnly
			/>

			<input
				hidden
				onChange={handleChange}
				type='file'
				id='fileUploader'
				ref={ref}
				multiple={multiple}
			/>

			<button
				aria-label='Browse Files'
				className='btn-warning'
				onClick={browseFile}>
				<FiFile /> Browse...
			</button>
		</div>
	)
}
