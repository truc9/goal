import React from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { FiCheckCircle } from "react-icons/fi"

dayjs.extend(weekday)

const OfficeBooking: React.FC = () => {

    //Get next monday
    const start = dayjs().weekday(8)
    const end = start.add(6, 'day')
    const days = Array.from(Array(7).keys()).map((d) => {
        return start.add(d, 'day')
    })

    return (
        <div className="tw-flex tw-flex-col tw-gap-5">
            <div className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
                <h4 className="tw-text-2xl">Office Boooking</h4>
                <h3 className="tw-text-3xl">{start.format('ddd DD/MM/YYYY')} - {end.format('ddd DD/MM/YYYY')}</h3>
            </div>
            <div className="tw-grid tw-grid-cols-7">
                {days.map((d, i) => {
                    return (
                        <div key={i} className="tw-border tw-h-10 tw-flex tw-justify-center tw-items-center">
                            {d.format('ddd')}
                        </div>
                    )
                })}
                {days.map((d, i) => {
                    return (
                        <div key={i} className="tw-h-16 tw-flex tw-items-center tw-justify-center">
                            <FiCheckCircle size={32} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OfficeBooking