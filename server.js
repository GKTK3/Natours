const mongoose = require('mongoose')
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

dotenv.config({path : './config.env'});
const app = require('./app');

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

const port = process.env.port ;
app.listen(port , () => {
    console.log(`App is listtening to the port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });