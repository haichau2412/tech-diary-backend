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
const video_1 = require("../models/video");
const uuid_1 = require("uuid");
(0, dotenv_1.config)();
// Configure the Google strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, params, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user = yield video_1.User.findOne({ googleId: profile.id });
        if (user) {
            done(null, user);
        }
        else {
            const uuid = (0, uuid_1.v4)();
            const newUser = new video_1.User({
                name: 'custom',
                uuid,
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
                googleId: profile.id
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
        const user = yield video_1.User.findById({
            uuid: id
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
