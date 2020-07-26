import * as Yup from 'yup';

export default {
  async store(req, res, next) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
      });

      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Validation Fails', messages: error.inner });
    }
  },
  async update(req, res, next) {
    try {
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
      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Validation Fails', messages: error.inner });
    }
  },
};
