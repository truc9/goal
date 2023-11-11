import { FiEye, FiPlay, FiTarget } from 'react-icons/fi'
import { PageContainer } from '../../components/PageContainer'
import httpClient from '../../services/httpClient'
import { AssignmentModel } from './models/MyAssessmentModel'
import { useQuery } from '@tanstack/react-query'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { Link, useNavigate } from 'react-router-dom'
import assignmentService from '../../services/assignmentService'
import { enqueueSnackbar } from 'notistack'

const MyAssessment = () => {
	const navigate = useNavigate()
	const { isLoading, data: assessments } = useQuery({
		queryKey: ['myAssignmentQuery'],
		queryFn: () => httpClient.get<AssignmentModel[]>('employees/my-assignments')
	})

	const handleStart = async (assignmentId: number) => {
		try {
			await assignmentService.startAssignment(assignmentId)
			navigate(assignmentId)
		} catch (err) {
			enqueueSnackbar('Oops! Can not start assignment. Please try again later.', { variant: 'error' })
		}
	}

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
									key={ass.assignmentId}
									className='flex items-center justify-between rounded bg-slate-100 p-5'>
									<div className='flex flex-col gap-3'>
										<h3 className='font-bold'>{ass.assessmentName}</h3>
										<small>Version {ass.version}</small>
									</div>
									<div>
										{ass.isCompleted ? (
											<Link to={`${ass.assignmentId}?mode=readonly`}>
												<button className='btn-secondary'>
													<FiEye /> View
												</button>
											</Link>
										) : (
											<button
												className='btn-primary'
												onClick={() => handleStart(ass.assignmentId)}>
												<FiPlay /> Start
											</button>
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
