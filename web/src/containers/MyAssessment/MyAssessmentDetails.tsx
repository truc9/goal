import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { FiChevronLeft, FiChevronRight, FiCoffee, FiSearch } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { AsyncContent } from '../../components/AsyncContent'
import { QuestionTypeDict } from '../../constant'
import { useEffect, useRef, useState } from 'react'
import { QuestionModel } from '../AssessmentSetup/models'
import { QuestionType } from '../AssessmentSetup/models/QuestionModel'
import questionService from '../../services/questionService'

const lsAssessmentKey = '__assessment_key__'

const MyAssessmentDetails = () => {
	const params = useParams()
	const textRef = useRef<any>(null!)
	const [question, setQuestion] = useState<QuestionModel | null>(null)
	const [answers, setAnswers] = useState<any>(null!)
	const [currentIndex, setCurrentIndex] = useState(1)
	const [multiChoices, setMultiChoices] = useState<number[]>([])

	const { isLoading, data: questions } = useQuery({
		queryKey: ['assessment_details_questions'],
		queryFn: () => questionService.getByVersion(Number(params.versionId)),
		enabled: params && !!params.versionId,
		initialData: []
	})

	useEffect(() => {
		if (questions && questions.length > 0) {
			setQuestion(questions.find((q) => q.ordinal === currentIndex) ?? null)
		}
	}, [questions, question, currentIndex])

	const goNext = () => {
		if (textRef.current) {
			textRef.current.value = ''
		}

		saveToStorage()
		if (currentIndex < (questions?.length ?? 0)) {
			setCurrentIndex(currentIndex + 1)
		}
		if (multiChoices.length > 0) {
			setMultiChoices([])
		}
	}

	const goPrev = () => {
		if (currentIndex > 1) {
			setCurrentIndex(currentIndex - 1)
		}
		setMultiChoices([])
	}

	const saveToStorage = () => {
		localStorage.setItem(lsAssessmentKey, JSON.stringify(answers))
	}

	const answersUpdate = (value: any) => {
		setAnswers({
			...answers,
			[question!.id!]: `${value}`
		})
	}

	const answersMultipleChoices = (e: any) => {
		if (e.target.checked) {
			setMultiChoices([...multiChoices, e.target.value])
		} else {
			setMultiChoices(multiChoices.filter((c) => c !== e.target.value))
		}
	}

	return (
		<PageContainer
			showGoBack
			title={questions?.length > 0 ? `Question ${currentIndex}/${questions?.length ?? 0}` : 'No Questions'}>
			<AsyncContent loading={isLoading}>
				{questions?.length > 0 && (
					<div className='flex flex-col'>
						<div className='flex items-center justify-between'>
							{currentIndex === 1 ? (
								<span className='flex w-32 items-center justify-center gap-2 rounded bg-slate-300 p-3 text-center text-xl'>
									<FiChevronLeft />
									Prev
								</span>
							) : (
								<button
									onClick={goPrev}
									className='flex w-32 items-center justify-center gap-2 rounded bg-rose-500 p-3 text-center text-xl text-white active:-translate-x-1'>
									<FiChevronLeft />
									Prev
								</button>
							)}

							{question && (
								<div className='flex items-center justify-center'>
									<span className='rounded bg-emerald-500 p-1 text-xs text-white'>
										{QuestionTypeDict[question.type]}
									</span>
								</div>
							)}

							{currentIndex === questions?.length ? (
								<button
									onClick={goNext}
									className='flex items-center justify-center gap-2 rounded bg-emerald-500 p-3 text-center text-xl text-white active:translate-x-1'>
									<FiSearch />
									Review
								</button>
							) : (
								<button
									onClick={goNext}
									className='flex w-32 items-center justify-center gap-2 rounded bg-orange-500 p-3 text-center text-xl text-white active:translate-x-1'>
									<FiChevronRight />
									Next
								</button>
							)}
						</div>
					</div>
				)}

				{!isLoading && questions?.length === 0 && (
					<div className='flex items-center justify-center gap-3 text-center text-xl text-slate-300'>
						<FiCoffee />
						<span>Oops! It is an empty assessment. Go and make your coffee</span>
					</div>
				)}

				{question && (
					<div className='flex flex-col gap-3 text-center'>
						<div className='flex items-center justify-center'>
							<div className='flex w-1/2 justify-center rounded-lg border border-slate-200 bg-slate-100 p-2 text-center text-xl'>
								<span>{question.description}</span>
							</div>
						</div>

						<div className='flex items-center justify-center'>
							<div className='flex w-1/2 justify-start rounded-lg border border-slate-200 bg-slate-100 p-5'>
								{question.type == QuestionType.YesNo && (
									<div className='flex flex-col rounded-lg p-2'>
										{['Yes', 'No'].map((c) => {
											return (
												<div
													key={c.toLowerCase()}
													className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
													<input
														className='text-2x h-8 w-8'
														id={`c${c.toLowerCase()}`}
														type='radio'
														name={`q${question.id}`}
														value={c}
														onChange={(e: any) => answersUpdate(e.target.value === 'Yes')}
													/>
													<label
														htmlFor={`c${c.toLocaleLowerCase()}`}
														className='hover:cursor-pointer'>
														{c}
													</label>
												</div>
											)
										})}
									</div>
								)}

								{question.type == QuestionType.YesNoNA && (
									<div className='flex flex-col'>
										{[
											{ name: 'Yes', value: 'yes' },
											{ name: 'No', value: 'no' },
											{ name: 'N/A', value: 'na' }
										].map((c) => {
											return (
												<div
													key={c.value}
													className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
													<input
														className='text-2x h-8 w-8'
														id={`c${c.value}`}
														type='radio'
														name={`q${question.id}`}
														onChange={() => answersUpdate(c.value)}
													/>
													<label htmlFor={`c${c.value}`} className='hover:cursor-pointer'>
														{c.name}
													</label>
												</div>
											)
										})}
									</div>
								)}

								{question.type == QuestionType.FreeText && (
									<div className='flex w-full'>
										<textarea
											ref={textRef}
											placeholder='Answer free text...'
											rows={10}
											onChange={(e: any) => answersUpdate(e.target.value)}
										/>
									</div>
								)}

								{question.type === QuestionType.SingleChoice && (
									<div className='flex flex-col'>
										{question.choices?.map((c) => {
											return (
												<div
													key={c.id}
													className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
													<input
														className='text-2x h-8 w-8'
														id={`c${c.id}`}
														type='radio'
														value={c.id}
														name={`q${question.id}`}
														onChange={(e: any) => answersUpdate(e.target.value)}
													/>
													<label htmlFor={`c${c.id}`} className='hover:cursor-pointer'>
														{c.description}
													</label>
												</div>
											)
										})}
									</div>
								)}

								{question.type === QuestionType.MultipleChoice && (
									<div className='flex flex-col'>
										{question.choices?.map((c) => {
											return (
												<div
													key={c.id}
													className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
													<input
														className='text-2x h-8 w-8'
														id={`c${c.id}`}
														type='checkbox'
														value={c.id}
														onChange={answersMultipleChoices}
													/>
													<label htmlFor={`c${c.id}`} className='hover:cursor-pointer'>
														{c.description}
													</label>
												</div>
											)
										})}
									</div>
								)}

								{question.type === QuestionType.Confirmation && (
									<div className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
										<input id='confirm' className='text-2x h-8 w-8' type='checkbox' />
										<label htmlFor='confirm' className='hover:cursor-pointer'>
											Confirm
										</label>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</AsyncContent>
		</PageContainer>
	)
}

export default MyAssessmentDetails
