// (async () => {
//     if (process.env.NODE_ENV !== "production") {
//       const dotenv = await import('dotenv');
//       dotenv.config();
//     }
// })();


import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import ExpressError from "./utils/ExpressError.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import MongoStore from "connect-mongo";

import userRoutes from "./routes/users.js"
import campgroundsRoutes from "./routes/campgrounds.js";
import reviewRoutes from "./routes/reviews.js";
import dotenv from "dotenv";

const dbUrl = process.env.DB_URL
// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: "session",
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dudmekqvq/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/", (req, res) => {
    res.render("home")
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; 
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})