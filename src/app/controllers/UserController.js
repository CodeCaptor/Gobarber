import User from '../models/User';

class UserController {
    async store(req, res) {
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
        const { email, password } = req.body;
        const user = await User.findByPk(req.userID);

        if (user !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Email in use' });
            }
        }
        if (password && !(await user.checkPassword(password))) {
            return res.status(401).json({error: "Wrong old password"});
        }
        const {id, name, provider} = await user.update(req.body);
        return res.json({id, name, provider});
    }
}

export default new UserController();
