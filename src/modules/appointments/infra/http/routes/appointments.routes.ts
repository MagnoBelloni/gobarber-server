import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated, appointmentsController.create);

// appointmentsRouter.get('/', async (request, response) => {
//     const appointmentRepository = new AppointmentsRepository();
//     const appointments = await appointmentRepository.find();

//     return response.json(appointments);
// });

appointmentsRouter.post('/');

export default appointmentsRouter;
