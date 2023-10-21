import { FC } from 'react'
import dateTimeUtil from '../utils/datetimeUtil'

interface Props {
	value: Date
	format?: string
}

export const LabelDateTime: FC<Props> = ({
	value,
	format = 'DD MMM YYYY hh:mm:ss'
}) => {
	return dateTimeUtil.format(value, format)
}
