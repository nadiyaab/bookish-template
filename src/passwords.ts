import * as crypto from "crypto";
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import {client} from './database';




// add users

export const addNewUser = (newUser: any) => {
    let lengthofSalt = 15;
    let salt = crypto.randomBytes(lengthofSalt).toString('base64');

    let valueToHash = newUser.password + salt;
    let hashedValue = crypto
    .createHash('sha256')
    .update(valueToHash)
    .digest('base64')

    return client('member')
       .insert({ id: newUser.id, first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email, password: salt, hash: hashedValue})
};

//sign in
export const tryLoginMember = (username: string) => {
    return client('members')
    .where('username', username)
    .select()
    .first()
}

export const tryLoginMember = async(email: string, password: string): Promise<Member | null> => {
    const member = await getMemberByEmail(email);
}




    