import {parseISO} from "date-fns"
import formatDate from '../../util/FormatDate'
import Mail from '../../lib/Mail';


class CancellationMail {
    get key() {
        return  'CancellationMail';
    }

    async handle({data}) {
        const {appointment} = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento Cancelado',
            template: 'cancellation',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: formatDate(parseISO(appointment.date))
            }
        });
    }
}
export default new CancellationMail();
