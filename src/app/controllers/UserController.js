import * as Yup from 'yup';
import User from '../models/User';

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
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (!userExists) {
            const { id, name, email, provider } = await User.create(req.body);
            return res.json({ id, name, email, provider });
        }
        return res.status(400).json({ error: 'Email aready used' });
    }

    async index(req, res) {
        const users = await User.findAll({});
        return res.json({ users });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().notRequired(),
            email: Yup.string().email().notRequired(),
            password: Yup.string().min(6).notRequired(),
            newPassword: Yup.string()
                .min(6)
                .when('password', (password, field) =>
                    password ? field.required() : field
                ),
            confirmNewPassword: Yup.string()
                .min(6)
                .when('newPassword', (newPassword, field) =>
                    newPassword
                        ? field.required().oneOf([Yup.ref('newPassword')])
                        : field.notRequired()
                ),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails' });
        }
        const { password } = req.body;
        const user = await User.findByPk(req.userID);

        if (req.body.email) {
            const { email } = req.body;
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: 'Email in use' });
            }
        }

        if (req.body.password) {
            if (password && !(await user.checkPassword(password))) {
                return res.status(401).json({ error: 'Wrong old password' });
            }
            req.body.password = req.body.newPassword;
        }

        const { id, name, provider } = await user.update(req.body);
        return res.json({ id, name, provider });
    }
}

export default new UserController();
