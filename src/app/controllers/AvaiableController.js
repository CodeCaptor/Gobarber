import CheckAvaiableAppointmentsService from '../services/CheckAvaiableAppointmentsService';

class AvaiableController {
  async index(req, res) {
    const { date } = req.query;
    const avaiable = await CheckAvaiableAppointmentsService.run(
      date,
      req.params.providerID
    );
    return res.json(avaiable);
  }
}

export default new AvaiableController();
