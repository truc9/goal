import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import {
	FiChevronLeft,
	FiChevronRight,
	FiSend,
	FiTriangle
} from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import questionService from '../../services/questionService'
import { AsyncContent } from '../../components/AsyncContent'
import { QuestionTypeDict } from '../../constant'
import { useEffect, useState } from 'react'
import { QuestionModel } from '../AssessmentSetup/models'
import { IoCafe } from 'react-icons/io5'
import { LinearProgress } from '@mui/material'
import { QuestionType } from '../AssessmentSetup/models/QuestionModel'

const MyAssessmentDetails = () => {
	const params = useParams()
	const [q, setQ] = useState<QuestionModel | null>(null)
	const [currentIndex, setCurrentIndex] = useState(1)
	const [progress, setProgress] = useState(0)

	const { isLoading, data: questions } = useQuery({
		queryKey: ['assessment_details_questions'],
		queryFn: () => questionService.getByVersion(Number(params.versionId)),
		enabled: params && !!params.versionId
	})

	useEffect(() => {
		if (questions) {
			setProgress((currentIndex / questions.length) * 100)
		}

		if (questions && questions.length > 0) {
			setQ(questions.find((q) => q.ordinal === currentIndex) ?? null)
		}
	}, [questions, q, currentIndex])

	const goNext = () => {
		if (currentIndex < (questions?.length ?? 0)) {
			setCurrentIndex(currentIndex + 1)
		}
	}

	const goPrev = () => {
		if (currentIndex > 1) {
			setCurrentIndex(currentIndex - 1)
		}
	}

	return (
		<PageContainer
			icon={<IoCafe />}
			title={`Assessment ${params.versionId}`}
			action={
				<div className='flex items-center gap-3'>
					<div className='text-xs font-bold text-slate-500'>
						Question {q?.ordinal} / {questions?.length}
					</div>
					<LinearProgress
						className='w-[250px] xl:w-[500px]'
						variant='determinate'
						value={progress}
					/>
					<span className='text-xs font-bold text-slate-500'>
						{Math.round(progress)}%
					</span>
				</div>
			}>
			<AsyncContent loading={isLoading}>
				{questions?.length === 0 && (
					<div className='flex items-center justify-center gap-3 text-center text-xl text-slate-300'>
						<FiTriangle /> No Questions
					</div>
				)}

				{q && (
					<div className='flex flex-col gap-3 text-center'>
						<div className='flex items-center justify-center text-4xl font-bold text-rose-500'>
							<span>{q.description}</span>
						</div>
						<span className='flex items-center justify-center text-xs'>
							{QuestionTypeDict[q.type]}
						</span>

						<div className='mt-5 flex justify-center'>
							{q.type == QuestionType.YesNo && (
								<div className='flex flex-col gap-3'>
									{['Yes', 'No'].map((c) => {
										return (
											<div className='flex items-center gap-3'>
												<input
													className='text-2x h-8 w-8'
													id={`c${c.toLowerCase()}`}
													type='radio'
													name={`q${q.id}`}
												/>
												<label
													htmlFor={`c${c.toLocaleLowerCase()}`}>
													{c}
												</label>
											</div>
										)
									})}
								</div>
							)}

							{q.type == QuestionType.YesNoNA && (
								<div className='flex flex-col gap-3'>
									{['Yes', 'No', 'N/A'].map((c) => {
										return (
											<div className='flex items-center gap-3'>
												<input
													className='text-2x h-8 w-8'
													id={`c${c.toLowerCase()}`}
													type='radio'
													name={`q${q.id}`}
												/>
												<label
													htmlFor={`c${c.toLocaleLowerCase()}`}>
													{c}
												</label>
											</div>
										)
									})}
								</div>
							)}

							{q.type == QuestionType.FreeText && (
								<div className='flex w-1/2'>
									<textarea
										placeholder='Answer free text...'
										rows={10}
									/>
								</div>
							)}

							{q.type === QuestionType.SingleChoice && (
								<div className='flex flex-col gap-3'>
									{q.choices?.map((c) => {
										return (
											<div className='flex items-center gap-3'>
												<input
													className='text-2x h-8 w-8'
													id={`c${c.id}`}
													type='radio'
													name={`q${q.id}`}
												/>
												<label htmlFor={`c${c.id}`}>
													{c.description}
												</label>
											</div>
										)
									})}
								</div>
							)}

							{q.type === QuestionType.MultipleChoice && (
								<div className='flex flex-col gap-3'>
									{q.choices?.map((c) => {
										return (
											<div className='flex items-center gap-3'>
												<input
													className='text-2x h-8 w-8'
													id={`c${c.id}`}
													type='checkbox'
												/>
												<label htmlFor={`c${c.id}`}>
													{c.description}
												</label>
											</div>
										)
									})}
								</div>
							)}

							{q.type === QuestionType.Confirmation && (
								<div className='flex items-center gap-3'>
									<input
										id='confirm'
										className='text-2x h-8 w-8'
										type='checkbox'
									/>
									<label htmlFor='confirm'>Confirm</label>
								</div>
							)}
						</div>
					</div>
				)}
				<div className='flex flex-col'>
					<div className='flex items-center justify-between'>
						{currentIndex === 1 ? (
							<span></span>
						) : (
							<button
								onClick={goPrev}
								className='flex w-32 items-center justify-center gap-2 rounded bg-black p-3 text-center text-xl text-white ring-emerald-400 ring-offset-2 hover:ring-2 active:-translate-x-1 active:ring-2'>
								<FiChevronLeft />
								Prev
							</button>
						)}
						{currentIndex === questions?.length ? (
							<button
								onClick={goNext}
								className='flex w-32 items-center justify-center gap-2 rounded bg-rose-500 p-3 text-center text-xl text-white ring-emerald-400 ring-offset-2 hover:ring-2 active:translate-x-1 active:ring-2'>
								<FiSend />
								Submit
							</button>
						) : (
							<button
								onClick={goNext}
								className='flex w-32 items-center justify-center gap-2 rounded bg-black p-3 text-center text-xl text-white ring-emerald-400 ring-offset-2 hover:ring-2 active:translate-x-1 active:ring-2'>
								<FiChevronRight />
								Next
							</button>
						)}
					</div>
				</div>
			</AsyncContent>
		</PageContainer>
	)
}

export default MyAssessmentDetails
