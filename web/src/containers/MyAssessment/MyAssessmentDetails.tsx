import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { FiChevronLeft, FiChevronRight, FiCoffee, FiSearch } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { AsyncContent } from '../../components/AsyncContent'
import { QuestionTypeDict } from '../../constant'
import { useEffect, useRef, useState } from 'react'
import { QuestionModel } from '../AssessmentSetup/models'
import { AnswerSubmissionModel, QuestionType } from '../AssessmentSetup/models/QuestionModel'
import questionService from '../../services/questionService'
import { MultiChoicesAnswer } from './components/MultiChoicesAnswer'
import { YesNoAnswer } from './components/YesNoAnswer'
import { SingleChoiceAnswer } from './components/SingleChoiceAnswer'

const AUTO_SAVE_KEY = '__assessmentautosaved__'

const MyAssessmentDetails = () => {
	const params = useParams()
	const textRef = useRef<any>(null!)
	const [question, setQuestion] = useState<QuestionModel | null>(null)
	const [answers, setAnswers] = useState<AnswerSubmissionModel[]>([])
	const [currentOrdinal, setCurrentOrdinal] = useState(1)

	const { isLoading, data: questions } = useQuery({
		queryKey: ['assessment_details_questions'],
		queryFn: () => questionService.getByVersion(Number(params.versionId)),
		enabled: params && !!params.versionId,
		initialData: []
	})

	useEffect(() => {
		return () => {
			localStorage.removeItem(AUTO_SAVE_KEY)
		}
	}, [])

	useEffect(() => {
		if (answers && answers.length > 0) {
			localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(answers))
		}
	}, [answers])

	useEffect(() => {
		if (questions && questions.length > 0) {
			const q = questions.find((q) => q.ordinal === currentOrdinal)
			setQuestion(q ?? null)
		}
	}, [questions, question, currentOrdinal])

	const goNext = () => {
		if (textRef.current) {
			textRef.current.value = ''
		}

		if (currentOrdinal < (questions?.length ?? 0)) {
			setCurrentOrdinal(currentOrdinal + 1)
		}
	}

	const goPrev = () => {
		if (currentOrdinal > 1) {
			setCurrentOrdinal(currentOrdinal - 1)
		}
	}

	const handleAnswerChange = (questionId: number, answer: any) => {
		let currentAnswers = answers
		if (answers.find((a) => a.questionId === questionId)) {
			currentAnswers = answers.filter((a) => a.questionId !== questionId)
		}

		setAnswers([
			...currentAnswers,
			{
				questionId,
				answer
			}
		])
	}

	return (
		<PageContainer
			showGoBack
			title={questions?.length > 0 ? `Question ${currentOrdinal}/${questions?.length ?? 0}` : 'No Questions'}>
			<AsyncContent loading={isLoading}>
				{questions?.length > 0 && (
					<div className='flex flex-col'>
						<div className='flex items-center justify-between'>
							{currentOrdinal === 1 ? (
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

							{currentOrdinal === questions?.length ? (
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
									<YesNoAnswer
										onChange={(e) => handleAnswerChange(question.id!, e)}
										defaultValue={question.answer}
									/>
								)}

								{question.type == QuestionType.YesNoNA && (
									<YesNoAnswer
										includeNA
										onChange={(e) => handleAnswerChange(question.id!, e)}
										defaultValue={question.answer}
									/>
								)}

								{question.type == QuestionType.FreeText && (
									<div className='flex w-full'>
										<textarea
											ref={textRef}
											placeholder='Answer free text...'
											rows={10}
											onChange={(e: any) => handleAnswerChange(question!.id!, e.target.value)}
											value={question.answer}
										/>
									</div>
								)}

								{question.type === QuestionType.SingleChoice && (
									<SingleChoiceAnswer
										choices={question.choices!}
										valueMember='id'
										displayMember='description'
										defaultValue={question.answer}
										onChange={(value) => handleAnswerChange(question.id!, value)}
									/>
								)}

								{question.type === QuestionType.MultipleChoice && (
									<MultiChoicesAnswer
										choices={question.choices!}
										displayMember='description'
										valueMember='id'
										defaultValues={question.answer}
										onChange={(values) => handleAnswerChange(question!.id!, values)}
									/>
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
