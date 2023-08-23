import mongoose from "mongoose";
import { cities } from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";
import Campground from "../models/campground.js";

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64ca9633e54bae648f54911c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dudmekqvq/image/upload/v1692162797/YelpCamp/ssdrmnisyhlhcmcqt2ns.jpg',
                  filename: 'YelpCamp/ssdrmnisyhlhcmcqt2ns',
                },
                {
                  url: 'https://res.cloudinary.com/dudmekqvq/image/upload/v1692162798/YelpCamp/rzckpflvijgkwwhcvpqp.jpg',
                  filename: 'YelpCamp/rzckpflvijgkwwhcvpqp',
                }
              ],
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis eaque reiciendis rerum earum corporis a maiores architecto asperiores amet facilis, aspernatur praesentium error ipsum aperiam accusantium numquam dolores accusamus quo!`,
            price, 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})