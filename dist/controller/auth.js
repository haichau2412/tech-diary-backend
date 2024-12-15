"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = require("dotenv");
const mongo_1 = require("../models/mongo");
const uuid_1 = require("uuid");
(0, dotenv_1.config)();
// Configure the Google strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://tech-diary-backend.vercel.app/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        console.log('profile', profile);
        let user = yield mongo_1.User.findOne({ googleId: profile.id });
        if (user) {
            user = yield mongo_1.User.findOneAndUpdate({ googleId: profile.id }, {
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                googleId: profile.id,
                name: ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName) || profile.displayName
            }, {
                new: true,
                upsert: true
            });
            if (user) {
                done(null, user);
            }
        }
        else {
            const uuid = (0, uuid_1.v4)();
            const newUser = new mongo_1.User({
                uuid,
                email: (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0].value,
                googleId: profile.id,
                name: ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.givenName) || profile.displayName
            });
            yield newUser.save();
            done(null, newUser);
        }
    }
    catch (err) {
        console.error(err);
        done(err, false);
    }
})));
// Serialize user to save session
passport_1.default.serializeUser((user, done) => {
    done(null, user.uuid);
});
// Deserialize user to retrieve session data
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield mongo_1.User.findById({
            uuid: id
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
