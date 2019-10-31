import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(401).json({ error: 'Validation fails' });
    }
    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      res.status(401).json({ error: 'Student not found' });
    }

    const studentPlan = await Plan.findByPk(plan_id);
    const { duration, price } = studentPlan;
    const totalPrice = duration * price;

    const parsedStartDate = parseISO(start_date);
    const parserdEndDate = addMonths(parsedStartDate, duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      price: totalPrice,
      start_date,
      end_date: parserdEndDate,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
