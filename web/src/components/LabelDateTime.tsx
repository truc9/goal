import { FC } from 'react'
import dateUtil from '../utils/DateUtil'

interface Props {
	value: Date
	format?: string
}

export const LabelDateTime: FC<Props> = ({
	value,
	format = 'DD MMM YYYY hh:mm:ss'
}) => {
	return dateUtil.format(value, format)
}
