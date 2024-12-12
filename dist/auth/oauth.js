"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_1 = __importDefault(require("passport"));
const node_process_1 = __importDefault(require("node:process"));
passport_1.default.use(new passport_google_oauth20_1.default({
    clientID: node_process_1.default.env['GOOGLE_CLIENT_ID'],
    clientSecret: node_process_1.default.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'https://www.example.com/oauth2/redirect/google',
    scope: ['profile'],
    state: true
}, function verify(accessToken, refreshToken, params, profile, cb) {
    //     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    //         'https://accounts.google.com',
    //         profile.id
    //     ], function (err, cred) {
    //         if (err) { return cb(err); }
    //         if (!cred) {
    //             // The account at Google has not logged in to this app before.  Create a
    //             // new user record and associate it with the Google account.
    //             db.run('INSERT INTO users (name) VALUES (?)', [
    //                 profile.displayName
    //             ], function (err) {
    //                 if (err) { return cb(err); }
    //                 var id = this.lastID;
    //                 db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
    //                     id,
    //                     'https://accounts.google.com',
    //                     profile.id
    //                 ], function (err) {
    //                     if (err) { return cb(err); }
    //                     var user = {
    //                         id: id,
    //                         name: profile.displayName
    //                     };
    //                     return cb(null, user);
    //                 });
    //             });
    //         } else {
    //             // The account at Google has previously logged in to the app.  Get the
    //             // user record associated with the Google account and log the user in.
    //             db.get('SELECT * FROM users WHERE id = ?', [cred.user_id], function (err, user) {
    //                 if (err) { return cb(err); }
    //                 if (!user) { return cb(null, false); }
    //                 return cb(null, user);
    //             });
    //         }
    //     });
    // }
}
//     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
//         'https://accounts.google.com',
//         profile.id
//     ], function (err, cred) {
//         if (err) { return cb(err); }
//         if (!cred) {
//             // The account at Google has not logged in to this app before.  Create a
//             // new user record and associate it with the Google account.
//             db.run('INSERT INTO users (name) VALUES (?)', [
//                 profile.displayName
//             ], function (err) {
//                 if (err) { return cb(err); }
//                 var id = this.lastID;
//                 db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
//                     id,
//                     'https://accounts.google.com',
//                     profile.id
//                 ], function (err) {
//                     if (err) { return cb(err); }
//                     var user = {
//                         id: id,
//                         name: profile.displayName
//                     };
//                     return cb(null, user);
//                 });
//             });
//         } else {
//             // The account at Google has previously logged in to the app.  Get the
//             // user record associated with the Google account and log the user in.
//             db.get('SELECT * FROM users WHERE id = ?', [cred.user_id], function (err, user) {
//                 if (err) { return cb(err); }
//                 if (!user) { return cb(null, false); }
//                 return cb(null, user);
//             });
//         }
//     });
// }
));
