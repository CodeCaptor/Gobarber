import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

import Cache from '../../lib/Cache';

class AppointmentController {
  async store(req, res) {
    const { provider_id, date } = req.body;
    const appointment = await CreateAppointmentService.run({
      provider_id,
      userID: req.userID,
      date,
    });

    /*
     * Update cache
     */
    const cacheKey = `user:${req.userID}`;
    Cache.invalidate(cacheKey);

    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.userID}:appointments:${page}`;
    const cached = await Cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: { user_id: req.userID, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
          include: [
            { model: File, as: 'avatar', attributes: ['url', 'name', 'path'] },
          ],
        },
      ],
    });
    await Cache.set(cacheKey, appointments);
    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      userID: req.userID,
      appointmentID: req.params.id,
    });

    /*
     * Update cache
     */
    const cacheKey = `user:${req.userID}`;
    Cache.invalidate(cacheKey);

    /*
     * notify provider with mail
     */

    Queue.add(CancellationMail.key, { appointment });
    return res.json(appointment);
  }
}

export default new AppointmentController();
