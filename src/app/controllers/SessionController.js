import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import authConfiguration from '../../config/auth'

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required()
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails' });
        }
        const user = await User.findOne({ where: { email }, include: [{model: File, as: 'avatar', attributes: ['path', 'url', 'id']}] });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password doesn't match" });
        }
        const { id, name, avatar } = user;
        return res.json({ user: { id, name, email, avatar }, token: jwt.sign({id}, authConfiguration.secret, {expiresIn: authConfiguration.expiresIn} ) });
    }
}

export default new SessionController();
