import passport from "passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { config } from "dotenv";
import { User } from "../models/mongo";
import { v4 as uuidv4 } from 'uuid';

config()

// Configure the Google strategy
passport.use(
    new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'https://tech-diary-backend.vercel.app/auth/google/callback',
        },
        async (accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback) => {
            try {
                console.log('profile', profile)

                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    user = await User.findOneAndUpdate({ googleId: profile.id }, {
                        email: profile.emails?.[0].value,
                        googleId: profile.id,
                        name: profile.name?.givenName || profile.displayName
                    }, {
                        new: true,
                        upsert: true
                    });

                    if (user) {
                        done(null, user);
                    }

                } else {
                    const uuid = uuidv4()
                    const newUser = new User({
                        uuid,
                        email: profile.emails?.[0].value,
                        googleId: profile.id,
                        name: profile.name?.givenName || profile.displayName
                    })
                    await newUser.save()
                    done(null, newUser);
                }
            } catch (err) {
                console.error(err);
                done(err, false);
            }
        }
    )
);

// Serialize user to save session
passport.serializeUser((user: any, done) => {
    done(null, user.uuid);
});

// Deserialize user to retrieve session data
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById({
            uuid: id
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});