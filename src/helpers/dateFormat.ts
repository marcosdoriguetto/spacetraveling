import { format } from 'date-fns'

export function dateFormat(date: string | null) {
  if (date) {
    return format(new Date(date), 'dd MMM yyyy').toLowerCase()
  }
}
