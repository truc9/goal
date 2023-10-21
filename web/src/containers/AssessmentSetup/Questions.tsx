import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { QuestionPopup } from './QuestionPopup'
import { QuestionModel } from './models/QuestionModel'
import questionService from '../../services/questionService'
import useBearStore from '../../store'
import { AsyncContent } from '../../components/AsyncContent'
import { QuestionItem } from './QuestionItem'
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult
} from '@hello-pangea/dnd'

const Questions = () => {
	const [loading, setLoading] = useState(false)
	const { versionId } = useParams()
	const store = useBearStore()
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
		await questionService.create({
			...question,
			ordinal: store.currentVersion.questionCount + 1
		})
		await loadQuestions()
	}

	async function handleDeleteQuestion(question: QuestionModel) {
		await questionService.remove(question.id!)
		await loadQuestions()
	}

	async function handleDragEnd(e: DropResult) {
		if (!e.destination) {
			return
		}
		const questions = store.currentVersion.questions
		const sourceQuestionId = questions[e.source.index].id!
		const destinationQuestionId = questions[e.destination.index].id!

		await questionService.updateOrdinal(sourceQuestionId, {
			destinationQuestionId
		})
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
							<DragDropContext onDragEnd={handleDragEnd}>
								<Droppable droppableId='droppable-list'>
									{(dropProvider) => (
										<div
											className='tw-flex tw-flex-col tw-gap-3'
											ref={dropProvider.innerRef}
											{...dropProvider.droppableProps}>
											{store.currentVersion?.questions?.map(
												(
													q: QuestionModel,
													index: number
												) => (
													<Draggable
														draggableId={`${q.id}`}
														index={index}>
														{(
															dragProvider,
															snapshot
														) => (
															<div
																ref={
																	dragProvider.innerRef
																}
																{...dragProvider.draggableProps}
																{...dragProvider.dragHandleProps}>
																<QuestionItem
																	isDragging={
																		snapshot.isDragging
																	}
																	key={q.id}
																	question={q}
																	onEdit={
																		handleDeleteQuestion
																	}
																	onDelete={
																		handleDeleteQuestion
																	}
																/>
															</div>
														)}
													</Draggable>
												)
											)}
											{dropProvider.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
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
