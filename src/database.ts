import pg from "pg";
import Knex from "knex";

export const client = Knex ({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'bookish',
        port: 5432
    }
});

//const bookshelf = require('bookshelf') (Knex)




export const getAllBooks = () => {
    return client('book')
    .select()
    .where("deleted", false)
   
}


export const getAllMembers = () => {
    return client('member')
    .select()
    .where("deleted", false)
}

//get member by email
export const getMemberByEmail = (email:string) => {
    return client.select("*").from<Member>("member")
    .where("email", email).first()
};
interface Book {
    id: number;
    title: string;
    author: string;
}

// interface singleBook {
  //  id: number;
  //  title: string;
  //  author: string;
  //  member_id: number;
  // check_out_date: number;
  // return_date: number;

//}
   
//get single book (findBook)
//export const findBook = (id : number) => {
    //return client.select("*").from<Book>("book")
    //.where('id', id).first();
//}

export const addBook = (id: number, title: string, author: string) => {
    return client.insert({id: id, title: title, author: author}).into("book")
}


export const deleteBook = (id: number) => {
    return client ('book').update("deleted", true)
    .where("id", id)
}


interface Member {
    id: number
    first_name: string;
    last_name: string;
    email: string;
    hash: string;
    password: string;
}


export const addMember = (id: number, first_name: string, last_name: string, email: string) => {
   return client.insert({id: id, first_name: first_name, last_name: last_name, email: email}).into("member")
}

export const deleteMember = (id: number) => {
    return client ('member').update("deleted", true)
    .where("id", id)
}


