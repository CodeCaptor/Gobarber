import { isBefore, subHours } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class CancelAppointmentService {
  async run({ userID, appointmentID }) {
    const appointment = await Appointment.findByPk(appointmentID, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    if (userID !== appointment.user_id) {
      throw new Error('Only the owner can cancel this appointment');
    }
    /*
     * check if date of query is acceptable to cancel
     */
    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      throw new Error(
        'Time to cancel this appointment is unvaiable, contact your provider'
      );
    }
    /*
     * saves canceled date to current date
     */
    appointment.canceled_at = new Date();
    await appointment.save();

    return appointment;
  }
}

export default new CancelAppointmentService();
