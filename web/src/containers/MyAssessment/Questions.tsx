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

	const { isLoading, data: questions } = useQuery({
		queryKey: ['assessment_details_questions'],
		queryFn: () => questionService.getByVersion(Number(params.versionId)),
		enabled: params && !!params.versionId,
		initialData: []
	})

	const dict = useMemo(() => {
		return Object.assign({}, ...questions.map((q, i) => ({ [i]: q })))
	}, [questions])

	const question = useMemo(() => {
		return dict[index] as QuestionModel
	}, [dict, index])

	useEffect(() => {
		console.log(question)
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

	const onAnswerChange = (questionId: number, value: any) => {
		console.log(questionId)
		console.log(value)
	}

	return (
		<PageContainer showGoBack title='Assessment Submission'>
			<AsyncContent loading={isLoading}>
				{questions?.length > 0 && (
					<div className='flex flex-col'>
						<div className='flex items-center justify-between'>
							{index === 0 ? (
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

							{index === questions?.length ? (
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
									<YesNoAnswer onChange={(e) => onAnswerChange(question.id!, e)} />
								)}

								{question.type == QuestionType.YesNoNA && (
									<YesNoAnswer
										includeNA
										onChange={(e) => onAnswerChange(question!.id!, e)}
										defaultValue={question.answer}
									/>
								)}

								{question.type == QuestionType.FreeText && (
									<div className='flex w-full'>
										<textarea
											placeholder='Answer free text...'
											rows={10}
											value={question.answer}
											onChange={(e: any) => onAnswerChange(question!.id!, e.target.value)}
										/>
									</div>
								)}

								{question.type === QuestionType.SingleChoice && (
									<SingleChoiceAnswer
										choices={question.choices!}
										valueMember='id'
										displayMember='description'
										onChange={(value) => onAnswerChange(question.id!, value)}
									/>
								)}

								{question.type === QuestionType.MultipleChoice && (
									<MultiChoicesAnswer
										choices={question.choices!}
										displayMember='description'
										valueMember='id'
										onChange={(values) => onAnswerChange(question!.id!, values)}
									/>
								)}

								{question.type === QuestionType.Confirmation && (
									<div className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
										<input
											id='confirm'
											className='text-2x h-8 w-8'
											type='checkbox'
											onChange={(e) => onAnswerChange(question.id!, e.target.value)}
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
