import * as usersService from "../services/usersServices.js";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

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

const tempDir = path.resolve("temp");

const avatarsDir = path.resolve("public/avatars");

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new HttpError(400, "Only image files are allowed"), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage, fileFilter });

export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new HttpError(400, "File is required");
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