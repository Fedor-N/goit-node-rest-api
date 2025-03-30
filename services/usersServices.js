import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from 'nanoid';

import User from '../models/users.js';

export async function register(data) {
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });
    if (user) {
        const error = new Error("User with this email already exists");
        error.status = 409;
        throw error;
    }
    const hashedPassword = await hashPassword(password);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email, { protocol: 'https', s: '200' });
    await User.create({ email, password: hashedPassword, avatarURL: avatarURL, verificationToken });
    return await User.findOne({ where: { email } });
};

export async function login(data) {
    const { email, password } = data;
    const user = await User.scope('withPassword').findOne({ where: { email: email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        const error = new Error("Email or password is wrong");
        error.status = 401;
        throw error;
    }
    const payload = { id: user.id, email: user.email, subscription: user.subscription };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    return await user.save();
};

export async function logout(id) {
    const user = await findUserById(id);
    if (!user) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }
    user.token = null;
    await user.save();
};

export async function findUserById(id) {
    return await User.findOne({ where: { id } });
}

export async function findUserByEmail(email) {
    return await User.findOne({ where: { email } });
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
}

export const verifyUser = async (verificationToken) => {
    const user = await User.findOne({ where: { verificationToken } });
    if (user) {
        user.verificationToken = null;
        user.verify = true;
        await user.save();
    }
    return user;
};

export const getOrCreateVerificationToken = async (user) => {
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    if (!user.verificationToken) {
        const verificationToken = nanoid();
        user.verificationToken = verificationToken;
        await user.save();
        return verificationToken;
    }
    return user.verificationToken;
}