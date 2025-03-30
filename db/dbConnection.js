import "dotenv/config";
import Sequelize from "sequelize";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const dbConnection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

try {
    await dbConnection.authenticate()
    console.log("Database connection successful");
} catch (e) {
    console.log("Database connection failed with error: ", e);
    process.exit(1);
}

export default dbConnection;