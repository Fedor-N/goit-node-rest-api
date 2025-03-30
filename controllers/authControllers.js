import * as usersService from "../services/usersServices.js";

export const register = async (req, res, next) => {
    try {
        const newUser = await usersService.register(req.body);
        res.status(201).json({
            "user": {
                "email": newUser.email,
                "subscription": newUser.subscription,
            }
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const signedUser = await usersService.login(req.body);
        res.status(200).json({
            token: signedUser.token,
            user: {
                email: signedUser.email,
                subscription: signedUser.subscription
            },
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            const error = new Error("Unauthorized");
            error.status = 401;
            throw error;
        }
        await usersService.logout(user.id);
        res.status(204).json();
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const current = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            const error = new Error("Unauthorized");
            error.status = 401;
            throw error;
        }
        res.status(200).json({
            email: user.email,
            subscription: user.subscription
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}