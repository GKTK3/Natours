const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authentiController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.get('/' , (req , res , next) => {
  try{
    res.status(200).json({
      status : 'Success'
    })
  } catch(err){
    res.status(400).json(
      err
    )
  }
})

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
