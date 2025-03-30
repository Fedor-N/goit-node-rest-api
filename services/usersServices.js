import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    await User.create({ email, password: hashedPassword });
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

const hashPassword = async (password) => {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
}