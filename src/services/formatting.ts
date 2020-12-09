import { Price } from 'models/database/auction'

export function formatPrice(price: Price):string {
    return (price / 100).toFixed(2)
}

export function formatDate(date: Date | string):string {
    date = (date instanceof Date) ? date : new Date(date)
    return date.toLocaleString()
}