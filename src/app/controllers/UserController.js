import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email already in use  ' });
    }
    const user = await User.create(req.body);
    const { id, name, email, provider } = user;
    return res.json({ id, name, email, provider });
  }

  async index(req, res) {
    const users = await User.findAll({});
    return res.json(users);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().notRequired(),
      email: Yup.string().email().notRequired(),
      oldPassword: Yup.string().min(6).notRequired(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userID);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(401).json({ error: 'Email in use' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    await user.update(req.body);
    const { id, name, avatar } = await User.findByPk(req.userID, {
      include: [
        { mode: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });
    return res.json({ id, name, avatar, email });
  }
}

export default new UserController();
