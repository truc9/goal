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
	const [isOpen, setIsOpen] = useState(false)

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
		await questionService.create({
			...question,
			ordinal: store.currentVersion.questionCount + 1
		})
		await loadQuestions()
		setIsOpen(false)
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

	async function openPopup() {
		await loadQuestions()
		setIsOpen(true)
	}

	return (
		<>
			<div className='flex h-full flex-1 flex-col gap-3'>
				<div className='flex flex-col gap-3 p-3 md:w-full'>
					<div className='flex items-center gap-2'>
						<button className='btn-secondary' onClick={openPopup}>
							<FiPlus /> Add Question
						</button>
					</div>
					<div className='flex flex-col gap-2'>
						<AsyncContent loading={loading}>
							<DragDropContext onDragEnd={handleDragEnd}>
								<Droppable droppableId='droppable-list'>
									{(dropProvider) => (
										<div
											className='flex flex-col gap-3'
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
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSubmit={handleSubmitQuestion}
			/>
		</>
	)
}

export default Questions
