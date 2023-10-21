import dayjs from "dayjs"

function format(date: Date, format: string = 'DD MMM YYYY') {
    return dayjs(date).format(format)
}

function formatDateTime(date: Date) {
    return dayjs(date).format("DD MMM YYYY hh:mm")
}


const dateUtil = {
    format,
    formatDateTime
}

export default dateUtil