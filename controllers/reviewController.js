const Review = require('./../models/reviewModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//Implement restriction to users review only tours they have booked
exports.isBooked = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ tour: req.body.tour });

  // 2) check if the currently logged in user is in the booking array or not
  const userIDs = bookings.map(el => el.user._id.toString());
  if (userIDs.includes(req.body.user)) return next();
  return next(
    new AppError('User can review only tours they have booked.', 401)
  );
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
