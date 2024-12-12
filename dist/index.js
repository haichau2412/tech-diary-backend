"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./libs/db");
const utubeNote_1 = __importDefault(require("./routes/videos/utubeNote"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = require("dotenv");
const auth_1 = __importDefault(require("./routes/auth/auth"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./controller/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
var corsOptions = {
    origin: process.env.UI_URL,
    credentials: true
};
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(body_parser_1.default.json());
app.use(utubeNote_1.default);
app.use(auth_1.default);
app.get('/', (req, res) => {
    res.status(404).send('This route does not exist.');
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
(0, db_1.main)();
