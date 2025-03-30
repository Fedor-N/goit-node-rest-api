import * as usersServices from "../services/usersServices.js";
import sendEmail from "../services/emailsServices.js";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

export const register = async (req, res, next) => {
    try {
        const newUser = await usersServices.register(req.body);
        await sendVerificationEmail(req, newUser.email, newUser.verificationToken);
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
}

export const login = async (req, res, next) => {
    try {
        const signedUser = await usersServices.login(req.body);
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
}

export const logout = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            const error = new Error("Unauthorized");
            error.status = 401;
            throw error;
        }
        await usersServices.logout(user.id);
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
}

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
}

export const verifyUser = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await usersServices.verifyUser(verificationToken);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: "Verification successful" });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const resendVerificationEmail = async (req, res, next) => {
    try {
        const userEmail = req.body.email;
        const user = await usersServices.findUserByEmail(userEmail);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (user.verify) {
            const error = new Error("Verification has already been passed");
            error.status = 400;
            throw error;
        }
        const verificationToken = await usersServices.getOrCreateVerificationToken(user);
        await sendVerificationEmail(req, userEmail, verificationToken);
        res.status(200).json({ message: "Verification email sent" });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function sendVerificationEmail(req, email, verificationToken) {
    try {
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
        await sendEmail({
            to: email,
            subject: "Verification email",
            text: `Please verify your email: ${verificationUrl}`,
            html: `<p>Please verify your email <a href="${verificationUrl}" target="_blank">${verificationUrl}</a></p>`,
        });
    }
    catch (err) {
        console.log("Error sending verification email: %s", err);
        throw err;
    }

}