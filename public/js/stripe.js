/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51LY8b0JBeQp5hrIwEIOTgByAQLP9jegQTp84FS2bQdIL3VR5jyDuRFeAe2w56g3qPdgnbEjo8ZmeSPWbzu6iYuQU00IMM2xdjF'
);

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );

    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
