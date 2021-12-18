const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;

module.exports = () => {
    return {
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_NAME,
        host: DATABASE_HOST,
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    };
}
