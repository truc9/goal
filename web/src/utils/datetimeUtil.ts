import dayjs from "dayjs"

function format(date: Date, format: string = 'DD MMM YYYY') {
    return dayjs(date).format(format)
}

function formatDateTime(date: Date) {
    return dayjs(date).format("DD MMM YYYY hh:mm")
}

function greeting() {
    const h = new Date().getHours()
    if (h < 9) {
        return '🌤️ Good Morning'
    } else if (h < 13) {
        return '☀️ Good Afternoon'
    }
    return '🌜 Good Evening'
}

const dateTimeUtil = {
    format,
    formatDateTime,
    greeting
}

export default dateTimeUtil