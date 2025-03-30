import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { findUserById } from "../services/usersServices.js";

const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, "Not authorized"));
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"));
    }
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUserById(id);
        if (!user || user.token !== token) {
            return next(HttpError(401, "Not authorized"));
        }
        req.user = user;
    } catch (err) {
        console.log(err);
        return next(HttpError(401, err.message));
    }
    console.log(req);
    next();
}

export default isAuthenticated;