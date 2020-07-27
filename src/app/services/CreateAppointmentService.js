import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, userID, date }) {
    /*
     * check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (userID === provider_id) {
      throw new Error('You can only create appointments with others providers');
    }
    if (!isProvider) {
      throw new Error('You can only create appointments with providers');
    }
    /*
     * check if date provided is a past date
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permited');
    }
    /*
     * check for date aviability
     */
    const checkAviability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });
    if (checkAviability) {
      throw new Error('Date not avaiable');
    }
    const appointment = await Appointment.create({
      user_id: userID,
      provider_id,
      date: hourStart,
    });
    /*
     * Notify current provider to new appointment
     */
    const user = await User.findByPk(userID);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' h:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    /*
     * Invalidate Cache
     */
    Cache.invalidatePrefix(`user:${userID}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
