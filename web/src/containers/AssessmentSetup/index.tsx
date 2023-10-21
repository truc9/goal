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
		const assessments = await assessmentService.getAll()
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
		<div className='tw-flex tw-h-full tw-border tw-p-2'>
			<div className='tw-flex tw-h-full tw-w-[300px] tw-flex-grow-0 tw-flex-col tw-border-r tw-shadow'>
				<div className='tw-h-full tw-overflow-auto'>
					<AsyncContent loading={loading}>
						{store.assessments.map(
							(item: AssessmentModel, index: number) => {
								return (
									<button
										key={index}
										onClick={() => onItemChange(item)}
										className={cn(
											'tw-relative tw-flex tw-h-28 tw-w-full tw-flex-col tw-justify-center tw-border-b tw-border-emerald-500 tw-border-b-slate-200 tw-bg-white tw-p-2 tw-text-left tw-transition-all hover:tw-border-l-4 hover:tw-bg-emerald-50 [&.active]:tw-border-l-4 [&.active]:tw-bg-emerald-50',
											{
												active:
													item.id ===
													store.currentAssessment?.id
											}
										)}>
										<Tooltip
											title={item.name}
											placement='right'>
											<div className='tw-h-2/5 tw-w-full tw-overflow-hidden tw-truncate tw-font-bold'>
												{item.name}
											</div>
										</Tooltip>
										<Tooltip
											title={item.description}
											placement='right'>
											<div className='tw-line-clamp-3 tw-h-3/5 tw-w-full tw-justify-between tw-overflow-hidden tw-text-xs tw-text-slate-400'>
												{item.description}
											</div>
										</Tooltip>
										<div className='tw-flex tw-w-full tw-items-center tw-justify-end tw-gap-3'>
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
			<main className='tw-flex-1'>
				<Outlet />
			</main>

			<Popup
				icon={<FiTriangle />}
				size='sm'
				title='Create Assessment'
				show={assessmentPopupOpen}
				onCloseClicked={() => setAssessmentPopupOpen(false)}
				onSubmitClicked={submit}>
				<div className='tw-flex tw-flex-col tw-items-center tw-gap-3'>
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
