import * as usersService from "../services/usersServices.js";
import fs from "fs/promises";
import path from "path";
import HttpError from "../helpers/HttpError.js"; // ✅ додано

const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
    try {
        const newUser = await usersService.register(req.body);
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        });
    } catch (err) {
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
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        await usersService.logout(req.user.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

export const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.status(200).json({ email, subscription });
    } catch (err) {
        next(err);
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new HttpError(400, "File is required"); // ✅ працює
        }

        const { path: tempPath, filename } = req.file;
        const finalPath = path.join(avatarsDir, filename);

        try {
            await fs.rename(tempPath, finalPath);
        } catch (moveError) {
            console.error("Error moving file:", moveError);
            await fs.unlink(tempPath);
            throw new HttpError(500, "Error saving avatar");
        }

        const avatarURL = `/avatars/${filename}`;
        await req.user.update({ avatarURL });

        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error);
    }
};
