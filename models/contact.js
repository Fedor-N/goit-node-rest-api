import dbConnection from "../db/dbConnection.js";
import { DataTypes } from "sequelize";
import { nanoid } from 'nanoid';

const Contact = dbConnection.define(
    'Contact', {
    id: {
        type: DataTypes.STRING(21),
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: () => nanoid(),
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}
);

export default Contact;