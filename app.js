const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utilities/appError');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// [1] GLOBAL MIDDLEWARES

//SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));
//SET SECURITY HTTP HEADERS
app.use(helmet({ contentSecurityPolicy: false }));
//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//LIMIT REQUESTS FROM THE SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many Requests from this IP , Please try again in an hour!'
});
app.use('/api', limiter);
//BODY PARSER || READ DATA FROM BODY TO req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST XSS ATTACKs
app.use(xss());
//PREVENT PARAMETERS POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// [2] ROUTE HANDLERS

//[3] ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', getTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'NOT FOUND!',
  //   message: `Can't find ${req.originalUrl} in our Website!!`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} in our Website!!`);
  // err.status = 'NOT FOUND!';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} in our Website!!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
