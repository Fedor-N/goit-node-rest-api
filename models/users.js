import dbConnection from "../db/dbConnection.js";
import DataTypes from "sequelize";

const User = dbConnection.define("User", {
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter"
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: {},
        },
    }
}
);

User.sync();

export default User;