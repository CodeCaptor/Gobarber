import {Router} from 'express';

const routes = Router();
routes.get("/", (req, res) => {
    return res.json({msg: "Hello! Listening..."})
})

export default routes;