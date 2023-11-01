import { FiEye, FiPlay, FiTarget } from 'react-icons/fi'
import { PageContainer } from '../../components/PageContainer'
import httpClient from '../../services/httpClient'
import { MyAssessmentModel } from './models/MyAssessmentModel'
import { useQuery } from '@tanstack/react-query'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { Link } from 'react-router-dom'

const MyAssessment = () => {
	const { isLoading, data: assessments } = useQuery({
		queryKey: ['myAssignmentQuery'],
		queryFn: () =>
			httpClient.get<MyAssessmentModel[]>('employees/my-assignments')
	})

	return (
		<PageContainer icon={<FiTarget />} title='My Assessment'>
			{isLoading ? (
				<LoadingSkeleton number={3} />
			) : (
				<div className='flex justify-center'>
					<div className='flex w-full flex-col justify-center gap-3 xl:w-1/2'>
						{assessments?.map((ass) => {
							return (
								<div
									key={ass.versionId}
									className='flex items-center justify-between rounded bg-slate-100 p-5'>
									<div className='flex flex-col gap-3'>
										<h3 className='font-bold'>
											{ass.assessmentName}
										</h3>
										<small>Version {ass.version}</small>
									</div>
									<div>
										{ass.isDone ? (
											<Link
												to={`${ass.versionId}?mode=readonly`}>
												<button className='btn-secondary'>
													<FiEye /> View
												</button>
											</Link>
										) : (
											<Link to={`${ass.versionId}`}>
												<button className='btn-primary'>
													<FiPlay /> Start
												</button>
											</Link>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</PageContainer>
	)
}

export default MyAssessment
