import { Price } from 'models/database/auction'

export function formatPrice(price: Price):string {
    return (price / 100).toFixed(2)
}

export function formatDate(date: Date | string):string {
    date = (date instanceof Date) ? date : new Date(date)
    return date.toLocaleString(
        'en-us',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    )
}

export function formatTime(date: Date | string):string {
    date = (date instanceof Date) ? date : new Date(date)
    return date.toLocaleTimeString('en-us',
    {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatRemaining(date: Date | string): string {
    date = (date instanceof Date) ? date : new Date(date)
    const t = date.getTime() - new Date().getTime()
    const days = Math.floor(t / (1000 * 60 * 60 * 24))
    const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((t % (1000 * 60)) / 1000)
    
    if (days > 0)
        return `${days} d ${hours} h`

    if (hours > 0)
        return `${hours} h ${minutes} m`

    if (minutes > 0)
        return `${minutes} m ${seconds} s`

    if (seconds > 0)
        return `${seconds} seconds`

    return ''
}