import { FC, useEffect, useRef, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { enqueueSnackbar } from 'notistack'

type FileExt = 'text/csv'

interface Props {
	multiple?: boolean
	onUpload?: (files: File[]) => Promise<void>
	extensions: FileExt[]
}

export const FileUploader: FC<Props> = ({ multiple, extensions, onUpload }) => {
	const ref = useRef<any>(null!)
	const [fileNames, setFileNames] = useState('')
	const [files, setFiles] = useState<File[]>([])

	useEffect(() => {
		return () => {
			ref.current = null
		}
	}, [])

	const browseFiles = () => {
		ref.current?.click()
	}

	const handleChange = (e: any) => {
		const hasFile = e.target.files && e.target.files[0]
		if (!hasFile) return

		const files = e.target.files

		let fileNames = ''
		for (let i = 0; i < files.length; i++) {
			fileNames += `${files[i].name},`
			if (!extensions.includes(files[i].type)) {
				enqueueSnackbar(`${files[i].type} is not supported.`, {
					variant: 'error'
				})
				setFileNames('')
				setFiles([])
				return
			}
		}
		fileNames = fileNames.substring(0, fileNames.length - 1)

		setFileNames(fileNames)
		setFiles(e.target.files)
	}

	const handleSubmit = async () => {
		if (!files || !files.length) {
			enqueueSnackbar('No file to upload', { variant: 'error' })
			return
		}

		if (onUpload) {
			await onUpload(files)
			ref.current.value = null
			setFileNames('')
			setFiles([])
		}
	}

	return (
		<div className='flex items-center gap-2 py-2'>
			<input
				role='button'
				value={fileNames}
				className='w-full rounded bg-slate-100 px-4 py-2 hover:ring-2 hover:ring-emerald-500'
				placeholder='Browse CSV file...'
				onClick={browseFiles}
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
				className='btn-primary'
				onClick={handleSubmit}>
				<FiUpload /> Upload
			</button>
		</div>
	)
}
