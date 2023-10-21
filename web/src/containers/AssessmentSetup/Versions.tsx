import { useEffect, useState } from 'react'
import cn from 'classnames'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import assessmentService from '../../services/assessmentService'
import { FiFile } from 'react-icons/fi'
import { IoListCircle } from 'react-icons/io5'
import { AssessmentVersionModel } from './models/AssessmentVersionModel'
import useBearStore from '../../store'
import { AsyncContent } from '../../components/AsyncContent'

const Versions = () => {
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { assessmentId } = useParams()
	const store = useBearStore()

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
		<div className='flex h-full flex-1'>
			<div className='flex h-full w-[300px] flex-col overflow-auto border-r bg-white'>
				<div className='h-full'>
					<AsyncContent loading={loading}>
						{store.currentAssessment?.versions?.map(
							(item: AssessmentVersionModel) => {
								return (
									<button
										key={item.id}
										onClick={() => onItemChange(item)}
										className={cn(
											'flex h-28 w-full flex-col justify-center gap-2 border-b border-emerald-500 border-b-slate-200 p-2 text-left transition-all hover:bg-emerald-50 [&.active]:border-l-4 [&.active]:bg-emerald-50',
											{
												active:
													item.id ===
													store.currentVersion?.id
											}
										)}>
										<div className='flex items-center gap-2 text-left'>
											<span>
												<FiFile size={16} />
											</span>
											<span>Version {item.version}</span>
										</div>
										<div className='flex w-full justify-between'>
											<span className='flex items-center gap-2 text-xs text-slate-400'>
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
			<main className='flex-1 bg-white'>
				<Outlet />
			</main>
		</div>
	)
}

export default Versions
