import React, { useState } from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { IoCheckmarkCircle } from "react-icons/io5"

dayjs.extend(weekday)

const OfficeBooking: React.FC = () => {

    const start = dayjs().weekday(8)
    const end = start.add(6, 'day')
    const days = Array.from(Array(7).keys()).map((d) => {
        return start.add(d, 'day')
    })

    const [dates, setDates] = useState<dayjs.Dayjs[]>([])

    const handleSelectDate = (d: dayjs.Dayjs) => {
        if (dates.find(date => date.isSame(d, 'day'))) {
            setDates(dates.filter(date => !date.isSame(d, 'day')))
        }
        else {
            setDates([...dates, d])
        }
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-5">
            <div className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
                <h4 className="tw-text-2xl">Office Boooking</h4>
                <h3 className="tw-text-3xl">{start.format('ddd DD.MMM.YYYY')} - {end.format('ddd DD.MMM.YYYY')}</h3>
            </div>
            <div>
                <table className='tw-w-full tw-table tw-border'>
                    <thead>
                        <tr>
                            {days.map((d, i) => {
                                return (
                                    <th key={i} className="tw-h-10 tw-justify-center tw-items-center">{d.format('ddd')}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tw-table-row">
                            {days.map((d, i) => {
                                const isSelected = !!dates.find(date => date.isSame(d, 'day'))
                                return (
                                    <td key={i}>
                                        <div className="tw-h-16 tw-flex tw-items-center tw-justify-center tw-transition-all">
                                            <a href="#" onClick={() => handleSelectDate(d)} className={`tw-text-slate-200 active:tw-translate-x-1 active:tw-translate-y-1 ${isSelected ? 'tw-text-green-500' : null}`}>
                                                <IoCheckmarkCircle size={40} />
                                            </a>
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OfficeBooking