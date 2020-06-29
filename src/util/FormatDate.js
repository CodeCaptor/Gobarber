import {format} from 'date-fns'
import pt from 'date-fns/locale/pt'

export default function FormatDate(date) {
    const dateFormated = format(date, "'dia' dd 'de' MMMM', às ' H:mm'h'", {locale: pt})
    return(dateFormated);
}
