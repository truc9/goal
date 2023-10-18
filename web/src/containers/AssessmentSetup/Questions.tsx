import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { QuestionPopup } from './QuestionPopup'
import { QuestionModel } from './models/QuestionModel'
import questionService from '../../services/questionService'
import useBeerStore from '../../store'
import { AsyncContent } from '../../components/AsyncContent'
import { QuestionItem } from './QuestionItem'

const Questions = () => {
	const [loading, setLoading] = useState(false)
	const { versionId } = useParams()
	const store = useBeerStore()
	const [openQuestionPopup, setOpenQuestionPopup] = useState(false)

	useEffect(() => {
		loadQuestions()
	}, [versionId])

	async function loadQuestions() {
		setLoading(true)
		const questions = await questionService.getByVersion(+versionId!)
		store.loadQuestions(questions)
		setLoading(false)
	}

	async function handleSubmitQuestion(question: QuestionModel) {
		setOpenQuestionPopup(false)
		await questionService.create(question)
		await loadQuestions()
	}

	async function handleDeleteQuestion(question: QuestionModel) {
		await questionService.remove(question.id!)
		await loadQuestions()
	}

	return (
		<>
			<div className='tw-flex tw-h-full tw-flex-1 tw-flex-col tw-gap-3'>
				<div className='tw-flex tw-flex-col tw-gap-3 tw-p-3 md:tw-w-full'>
					<div className='tw-flex tw-items-center tw-gap-2'>
						<button
							className='btn-secondary'
							onClick={() => setOpenQuestionPopup(true)}>
							<FiPlus /> Add Question
						</button>
					</div>
					<div className='tw-flex tw-flex-col tw-gap-2'>
						<AsyncContent loading={loading}>
							{store.currentVersion?.questions?.map(
								(q: QuestionModel) => (
									<QuestionItem
										key={q.id}
										question={q}
										onEdit={handleDeleteQuestion}
										onDelete={handleDeleteQuestion}
									/>
								)
							)}
						</AsyncContent>
					</div>
				</div>
			</div>

			<QuestionPopup
				versionId={+versionId!}
				isOpen={openQuestionPopup}
				onClose={() => setOpenQuestionPopup(false)}
				onSubmit={handleSubmitQuestion}
			/>
		</>
	)
}

export default Questions
