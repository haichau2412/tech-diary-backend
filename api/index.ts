import express, { Request, Response } from 'express';
import { main } from './libs/db';
import utubeNote from './routes/videos/utubeNote'
import session from 'express-session'
import passport from 'passport';
import { config } from 'dotenv';
import auth from './routes/auth/auth'
import bodyParser from 'body-parser';
import './controller/auth'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

var corsOptions = {
  origin: process.env.UI_URL,
  credentials: true
}

const app = express();
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),

);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(utubeNote)
app.use(auth)


app.get('/', (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


main()

