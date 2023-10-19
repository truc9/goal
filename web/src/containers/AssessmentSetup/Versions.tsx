import { useEffect, useState } from 'react'
import cn from 'classnames'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import assessmentService from '../../services/assessmentService'
import { FiFile } from 'react-icons/fi'
import { IoListCircle } from 'react-icons/io5'
import { AssessmentVersionModel } from './models/AssessmentVersionModel'
import useBeerStore from '../../store'
import { AsyncContent } from '../../components/AsyncContent'

const Versions = () => {
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { assessmentId } = useParams()
	const store = useBeerStore()

	useEffect(() => {
		load()
	}, [assessmentId])

	async function load() {
		setLoading(true)
		const versions = await assessmentService.getVersions(+assessmentId!)
		store.loadVersions(versions)
		setLoading(false)
	}

	function onItemChange(e: AssessmentVersionModel) {
		store.loadCurrentVersion(e)
		navigate(`versions/${e.id!}`)
	}

	return (
		<div className='tw-flex tw-h-full tw-flex-1'>
			<div className='tw-flex tw-h-full tw-w-[300px] tw-flex-col tw-overflow-auto tw-border-r tw-bg-white'>
				<div className='tw-h-full'>
					<AsyncContent loading={loading}>
						{store.currentAssessment?.versions?.map(
							(item: AssessmentVersionModel) => {
								return (
									<button
										key={item.id}
										onClick={() => onItemChange(item)}
										className={cn(
											'tw-flex tw-h-28 tw-w-full tw-flex-col tw-justify-center tw-gap-2 tw-border-b tw-border-violet-500 tw-border-b-slate-200 tw-p-2 tw-text-left tw-transition-all hover:tw-bg-violet-50 [&.active]:tw-border-l-4 [&.active]:tw-bg-violet-50',
											{
												active:
													item.id ===
													store.currentVersion?.id
											}
										)}>
										<div className='tw-flex tw-items-center tw-gap-2 tw-text-left'>
											<span>
												<FiFile size={16} />
											</span>
											<span>Version {item.version}</span>
										</div>
										<div className='tw-flex tw-w-full tw-justify-between'>
											<span className='tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-slate-400'>
												<IoListCircle />
												{item.id ===
												store.currentVersion.id
													? store.currentVersion
															.questionCount
													: item.questionCount}{' '}
												questions
											</span>
										</div>
									</button>
								)
							}
						)}
					</AsyncContent>
				</div>
			</div>
			<main className='tw-flex-1 tw-bg-white'>
				<Outlet />
			</main>
		</div>
	)
}

export default Versions
