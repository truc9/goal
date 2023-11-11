import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { AsyncContent } from '../../components/AsyncContent'
import { useEffect, useMemo, useState } from 'react'
import { QuestionModel, QuestionType } from '../AssessmentSetup/models/QuestionModel'
import { YesNoAnswer } from './components/YesNoAnswer'
import { MultiChoicesAnswer } from './components/MultiChoicesAnswer'
import { SingleChoiceAnswer } from './components/SingleChoiceAnswer'
import questionService from '../../services/questionService'

const Questions = () => {
	const params = useParams()
	const [index, setIndex] = useState(0)
	const [question, setQuestion] = useState<QuestionModel | null>(null!)
	const [savedAnswer, setSavedAnswer] = useState<any>('')

	const { isLoading, data: questions } = useQuery({
		queryKey: ['assessment_details_questions'],
		queryFn: () => questionService.getByVersion(Number(params.versionId)),
		enabled: params && !!params.versionId,
		initialData: []
	})

	const questionDict = useMemo(() => {
		return Object.assign({}, ...questions.map((q, i) => ({ [i]: { ...q, answer: '' } })))
	}, [questions])

	useEffect(() => {
		return () => {
			for (const q of questions) {
				localStorage.removeItem(`q${q.id}`)
			}
		}
	}, [questions])

	useEffect(() => {
		setQuestion(questionDict[index])
	}, [questionDict, index])

	useEffect(() => {
		if (question) {
			const saved = localStorage.getItem(`q${question.id}`)
			if (saved) {
				const parsed = JSON.parse(saved)
				setSavedAnswer(parsed)
			}

			if (question.answer) {
				localStorage.setItem(`q${question.id}`, JSON.stringify(question.answer))
			}
		}
	}, [question])

	const goNext = () => {
		if (index < questions.length - 1) {
			setIndex(index + 1)
		}
	}

	const goPrev = () => {
		if (index > 0) {
			setIndex(index - 1)
		}
	}

	const onAnswerChange = (answer: any) => {
		const q = { ...question, answer }
		setQuestion(q)
	}

	return (
		<PageContainer
			showGoBack
			title='Assessment Submission'
			action={
				<div className='rounded bg-rose-500 px-3 py-1 text-white'>
					Question {question?.id} ({index + 1}/{questions.length ?? 0})
				</div>
			}>
			<AsyncContent loading={isLoading}>
				{questions?.length > 0 && (
					<div className='flex flex-col'>
						<div className='flex items-center justify-between'>
							{index > 0 ? (
								<button
									onClick={goPrev}
									className='flex w-32 items-center justify-center gap-2 rounded bg-slate-300 p-3 text-center text-xl active:-translate-x-1'>
									<FiChevronLeft />
									Prev
								</button>
							) : (
								<span></span>
							)}

							{index === questions?.length - 1 ? (
								<button
									onClick={goNext}
									className='flex items-center justify-center gap-2 rounded bg-emerald-500 p-3 text-center text-xl text-white active:translate-x-1'>
									<FiSearch />
									Review
								</button>
							) : (
								<button
									onClick={goNext}
									className='flex w-32 items-center justify-center gap-2 rounded bg-slate-300 p-3 text-center text-xl active:translate-x-1'>
									<FiChevronRight />
									Next
								</button>
							)}
						</div>
					</div>
				)}

				{question && (
					<div className='flex flex-col gap-3 text-center'>
						<div className='flex items-center justify-center'>
							<div className='flex w-1/2 justify-center text-center text-xl'>
								<span>{question.description}</span>
							</div>
						</div>
						<div className='flex items-center justify-center'>
							<div className='flex w-1/2 justify-start'>
								{question.type == QuestionType.YesNo && (
									<YesNoAnswer onChange={(value) => onAnswerChange(value)} value={savedAnswer} />
								)}

								{question.type == QuestionType.YesNoNA && (
									<YesNoAnswer
										includeNA
										onChange={(value) => onAnswerChange(value)}
										value={savedAnswer}
									/>
								)}

								{question.type == QuestionType.FreeText && (
									<div className='flex w-full'>
										<textarea
											placeholder='Answer free text...'
											defaultValue={savedAnswer}
											rows={10}
											onChange={(e: any) => onAnswerChange(e.target.value)}
										/>
									</div>
								)}

								{question.type === QuestionType.SingleChoice && (
									<SingleChoiceAnswer
										choices={question.choices!}
										valueMember='id'
										displayMember='description'
										defaultValue={savedAnswer}
										onChange={(value) => onAnswerChange(value)}
									/>
								)}

								{question.type === QuestionType.MultipleChoice && (
									<MultiChoicesAnswer
										choices={question.choices!}
										displayMember='description'
										valueMember='id'
										defaultValues={savedAnswer}
										onChange={(values) => onAnswerChange(values)}
									/>
								)}

								{question.type === QuestionType.Confirmation && (
									<div className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
										<input
											id='confirm'
											className='text-2x h-8 w-8'
											type='checkbox'
											checked={!!savedAnswer}
											onChange={(e) => onAnswerChange(e.target.checked)}
										/>
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

export default Questions
