const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

dotenv.config({path : './config.env'});

// console.log(process.env);
const DB = process.env.DATABASE_LINK.replace('<PASSWORD>' , process.env.DATABASE_PASS)
mongoose.connect(DB , {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
    useUnifiedTopology: true,
}).then(con => {
    // console.log(con.connections); 
    console.log('Database Connected Successfullyy');
})

// reading the json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json` , `utf-8`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json` , `utf-8`))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json` , `utf-8`))

//importing datat in db

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users , {validateBeforeSave : false});
        await Review.create(reviews);

        console.log('Data Sucesfully Loaded')
    } catch (err){
        console.log(err)
    }
    process.exit()
};

//DELETE ALL DATA FROM DATABASE

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data Sucesfully deleted')
    } catch (err){
        console.log(err)
    }
    process.exit()
}


if(process.argv[2] === '--import') {
    importData()
} else if(process.argv[2] === '--delete'){
    deleteData()
} 

// console.log(process.argv);