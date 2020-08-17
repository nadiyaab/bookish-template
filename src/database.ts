import pg from "pg";
import promptSync from "prompt-sync";
import Knex from "knex";

const client = Knex ({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'bookish',
        port: 5432
    }
});

const getAllBooks = () => {
    return client('book')
    .select()
}

export default {getAllBooks};