import { FC } from 'react'
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
				'flex flex-col rounded border-l-4 border-emerald-500 bg-slate-100 p-5 transition-all hover:translate-x-1 hover:cursor-move',
				{ 'bg-emerald-500 text-white shadow': isDragging }
			)}>
			<div className='flex items-center gap-3'>
				<div className='flex items-center font-bold text-emerald-500'>
					Q{question.ordinal}
				</div>
				<div className='flex w-full justify-between'>
					<div className='flex-1'>{question.description}</div>
					<div className='flex w-[200px] items-center justify-between gap-5'>
						<span className='w-[150px]'>
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
				<span className='mt-2 px-4'>Choices</span>
			)}
			{question.choices!.map((ch, i: number) => (
				<div
					key={i}
					className='flex items-center justify-start gap-2 px-8 py-2'>
					<FiCheckSquare />
					{ch.description}
				</div>
			))}
		</div>
	)
}
