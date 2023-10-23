import { useEffect, useState } from 'react'
import cn from 'classnames'
import assessmentService from '../../services/assessmentService'
import { FiEdit, FiTriangle } from 'react-icons/fi'
import { Outlet, useNavigate } from 'react-router-dom'
import useBearStore from '../../store'
import { Popup } from '../../components/Popup'
import { FormGroup, FormLabel, Tooltip } from '@mui/material'
import { AssessmentModel } from './models/AssessmentModel'
import { AsyncContent } from '../../components/AsyncContent'

const AssessmentSetup = () => {
	const navigate = useNavigate()
	const store = useBearStore()
	const [assessmentPopupOpen, setAssessmentPopupOpen] = useState(false)
	const [assessmentModel, setAssessmentModel] = useState<AssessmentModel>(
		new AssessmentModel()
	)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		init()

		store.addAction({
			key: 'addAssessment',
			name: 'Assessment',
			actionFn: createAssessment
		})

		return () => {
			store.removeAction('addAssessment')
		}
	}, [])

	async function init() {
		await loadAssessments()
	}

	async function loadAssessments() {
		setLoading(true)
		const assessments = await assessmentService.getAssessments()
		store.loadAssessments(assessments)
		setLoading(false)
	}

	function onItemChange(e: AssessmentModel) {
		store.loadCurrentAssessment(e)
		navigate(`${e.id!}`)
	}

	function showPopup() {
		setAssessmentModel(new AssessmentModel())
		setAssessmentPopupOpen(true)
	}

	function createAssessment() {
		showPopup()
	}

	function editAssessment(item: AssessmentModel) {
		setAssessmentModel(item)
		setAssessmentPopupOpen(true)
	}

	function onAssessmentChange(e: any) {
		setAssessmentModel({
			...assessmentModel,
			[e.target.name]: e.target.value
		})
	}

	async function submit() {
		if (!assessmentModel.id) {
			await assessmentService.create(
				assessmentModel.name,
				assessmentModel.description
			)
		} else {
			await assessmentService.update(assessmentModel.id, assessmentModel)
		}
		setAssessmentPopupOpen(false)
		await loadAssessments()
	}

	return (
		<div className='flex h-full border p-2'>
			<div className='flex h-full w-[300px] flex-grow-0 flex-col border-r shadow'>
				<div className='h-full overflow-auto'>
					<AsyncContent loading={loading}>
						{store.assessments.map(
							(item: AssessmentModel, index: number) => {
								return (
									<button
										key={index}
										onClick={() => onItemChange(item)}
										className={cn(
											'relative flex h-28 w-full flex-col justify-center border-b border-emerald-500 border-b-slate-200 bg-white p-2 text-left transition-all hover:border-l-4 hover:bg-emerald-50 [&.active]:border-l-4 [&.active]:bg-emerald-50',
											{
												active:
													item.id ===
													store.currentAssessment?.id
											}
										)}>
										<Tooltip
											title={item.name}
											placement='right'>
											<div className='h-2/5 w-full overflow-hidden truncate font-bold'>
												{item.name}
											</div>
										</Tooltip>
										<Tooltip
											title={item.description}
											placement='right'>
											<div className='line-clamp-3 h-3/5 w-full justify-between overflow-hidden text-xs text-slate-400'>
												{item.description}
											</div>
										</Tooltip>
										<div className='flex w-full items-center justify-end gap-3'>
											<button
												onClick={() =>
													editAssessment(item)
												}>
												<FiEdit />
											</button>
										</div>
									</button>
								)
							}
						)}
					</AsyncContent>
				</div>
			</div>
			<main className='flex-1'>
				<Outlet />
			</main>

			<Popup
				icon={<FiTriangle />}
				size='sm'
				title='Create Assessment'
				show={assessmentPopupOpen}
				onCloseClicked={() => setAssessmentPopupOpen(false)}
				onSubmitClicked={submit}>
				<div className='flex flex-col items-center gap-3'>
					<FormGroup sx={{ width: '100%' }}>
						<FormLabel>Name</FormLabel>
						<input
							value={assessmentModel.name}
							onChange={onAssessmentChange}
							type='text'
							name='name'
							id='name'
						/>
					</FormGroup>
					<FormGroup sx={{ width: '100%' }}>
						<FormLabel>Description</FormLabel>
						<textarea
							value={assessmentModel.description}
							onChange={onAssessmentChange}
							name='description'
							id='description'
							rows={5}></textarea>
					</FormGroup>
				</div>
			</Popup>
		</div>
	)
}

export default AssessmentSetup
