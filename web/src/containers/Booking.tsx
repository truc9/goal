import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { IoBookOutline, IoCheckmarkCircle } from "react-icons/io5"
import { PageContainer } from "../components/PageContainer"
import bookingService from "../services/bookingService"
import { MenuItem, Select } from "@mui/material"
import { KV } from "../services/models/kv"
import { BookingPeriod } from "../services/models/booking"
import { FiCalendar, FiXCircle } from "react-icons/fi"

dayjs.extend(weekday)

const Booking: React.FC = () => {
    const [periodOptions, setPeriodOptions] = useState<KV[]>([])
    const [periods, setPeriods] = useState<BookingPeriod[]>([])
    const [currentPeriod, setCurrentPeriod] = useState<BookingPeriod>()
    const [dates, setDates] = useState<dayjs.Dayjs[]>([])

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        const days = Array.from(Array(7).keys()).map(d => {
            return dayjs(currentPeriod?.from).add(d, 'day')
        })
        setDates(days)
    }, [currentPeriod])

    const load = async () => {
        const result = await bookingService.getPeriods()
        setPeriods(result)
        setPeriodOptions(result.map(v => ({ key: v.id, value: `${dayjs(v.from).format('DD/MM/YYYY')} - ${dayjs(v.to).format('DD/MM/YYYY')}` })))
    }

    const handleSelectDate = (d: dayjs.Dayjs) => {
        console.log(d)
    }

    const handleChangePeriod = (e: any) => {
        const current = periods.find(p => p.id === e.target.value)
        setCurrentPeriod(current)
    }

    return (
        <PageContainer icon={<IoBookOutline size={26} />} title="Office Booking">
            <div className="tw-flex tw-flex-col tw-gap-5">
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-w-[300px]">
                        <Select
                            fullWidth
                            onChange={handleChangePeriod}
                        >
                            <MenuItem value="">
                                No Selection
                            </MenuItem>
                            {periodOptions.map((p, k) => (
                                <MenuItem key={k} value={p.key}>{p.value}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    {currentPeriod ? (
                        <div>
                            <span className="tw-flex tw-items-center tw-gap-3 tw-text-2xl"><FiCalendar /> {dayjs(currentPeriod?.from).format('ddd DD/MMM')} - {dayjs(currentPeriod?.to).format('ddd DD/MMM')}</span>
                        </div>
                    ) : (
                        <h3 className="tw-flex tw-items-center tw-gap-3 tw-text-2xl tw-text-red-500"><FiXCircle /> No Period Selected</h3>
                    )}
                </div>
                {currentPeriod && (
                    <table className='tw-w-full tw-table tw-border'>
                        <thead>
                            <tr>
                                {dates.map((d, i) => {
                                    return (
                                        <th key={i} className="tw-border tw-h-10 tw-justify-center tw-items-center">{d.format('ddd DD/MMM/YYYY')}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="tw-table-row">
                                {dates.map((d, i) => {
                                    const isSelected = !!dates.find(date => date.isSame(d, 'day'))
                                    return (
                                        <td key={i} className="tw-border">
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
                )}
            </div>
        </PageContainer>
    )
}

export default Booking