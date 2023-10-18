import { FC } from 'react'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { FiCheckSquare, FiEdit, FiTrash } from 'react-icons/fi'
import { QuestionTypeDict } from '../../constant'
import { QuestionModel } from './models'
import cn from 'classnames'

interface Props {
	isDragging?: boolean
	question: QuestionModel
	onDelete: (q: QuestionModel) => void
	onEdit: (q: QuestionModel) => void
}

export const QuestionItem: FC<Props> = ({
	isDragging,
	question,
	onDelete,
	onEdit
}) => {
	return (
		<div
			className={cn(
				'tw-flex tw-flex-col tw-rounded tw-border-l-4 tw-border-violet-500 tw-bg-slate-100 tw-p-5 tw-transition-all hover:tw-translate-x-1 hover:tw-cursor-move',
				{ 'tw-bg-violet-500 tw-text-white tw-shadow': isDragging }
			)}>
			<div className='tw-flex tw-items-center tw-gap-3'>
				<AiFillQuestionCircle size={25} />
				<div className='tw-flex tw-w-full tw-justify-between'>
					<div className='flex-1'>{question.description}</div>
					<div className='tw-flex tw-w-[200px] tw-items-center tw-justify-between tw-gap-5'>
						<span className='tw-w-[150px]'>
							{QuestionTypeDict[question.type]}
						</span>
						<button onClick={() => onDelete(question)}>
							<FiTrash />
						</button>
						<button onClick={() => onEdit(question)}>
							<FiEdit />
						</button>
					</div>
				</div>
			</div>
			{question.choices!.length > 0 && (
				<span className='tw-mt-2 tw-px-4'>Choices</span>
			)}
			{question.choices!.map((ch, i: number) => (
				<div
					key={i}
					className='tw-flex tw-items-center tw-justify-start tw-gap-2 tw-px-8 tw-py-2'>
					<FiCheckSquare />
					{ch.description}
				</div>
			))}
		</div>
	)
}
