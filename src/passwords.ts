import * as crypto from "crypto";
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import {client} from './database';



// add users

export const addNewUser = (newUser: any, password: any) => {
    const lengthofSalt = 10;
    const salt = crypto.randomBytes(lengthofSalt).toString('base64');

    const valueToHash = newUser.password+salt
    const hashedValue = crypto
    .createHash('sha256')
    .update(valueToHash)
    .digest('base64');





    return client('users')
       .insert({ first_name: newUser.first_name, last_name: newUser.last_name, username:newUser.username, salt: salt, hash:hashedValue})
};