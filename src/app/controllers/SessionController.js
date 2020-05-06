/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password doesn't match." });
        }
        const { id, name } = user;
        return res.json({
            user: { id, name },
            token: jwt.sign({ id }, '15f2a9f750debb571691fa47727814a0', {
                expiresIn: '7d',
            }),
        });
    }
}

export default new SessionController();
