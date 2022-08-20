const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION !💥, Shutting down ...`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`DB Connected Successfully`);
  });

const app = require('./app');
const { exists } = require('./models/tourModel');

console.log(process.env.NODE_ENV);
//[4] START THE SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is Running on port : ${port}...`);
});

process.on('unhandeledRejection', err => {
  console.log(err.name, err.message);
  console.log(`UNHANDELED REJECTION !💥, Shutting down ...`);
  server.close(() => {
    process.exit(1);
  });
});
