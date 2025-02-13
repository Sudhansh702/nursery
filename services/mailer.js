const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

const sendOrderConfirmation = async ({ email, orderId, products, totalPrice, shippingAddress }) => {
  console.log("sendOrderConfirmation")
  const mailOptions = {
    from: 'snonu522@gmail.com',
    to: email,
    subject: 'Order Confirmation - Nursery Store',
    html: `
      <h1>Thank you for your order!</h1>
      <h2>Order Details:</h2>
      <p>Order ID: ${orderId}</p>
      <p>Total Amount: ${totalPrice}</p>
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.firstname} ${shippingAddress.lastname}</p>
      <p>${shippingAddress.street_address}</p>
      <p>${shippingAddress.city}, ${shippingAddress.state}</p>
      <p>${shippingAddress.country} - ${shippingAddress.pin_code}</p>
      <p>Phone: ${shippingAddress.phone}</p>
      <h3>Products Ordered:</h3>
      ${products.map(product => `
        <p>- ${product.name}</p>
      `).join('')}
    `
  };
  console.log("mail sent")
  return transporter.sendMail(mailOptions);
};
const sendOrderCancellation = async ({ email, orderId, products, totalPrice, cancellationDate }) => {
    console.log("sendOrderCancellation");
    const mailOptions = {
      from: 'snonu522@gmail.com',
      to: email,
      subject: `Order Cancellation Confirmation - Order #${orderId}`,
      html: `
        <h1>Order Cancellation Confirmation</h1>
        <p>Dear Customer,</p>
        <p>Your order #${orderId} has been successfully cancelled on ${cancellationDate.toLocaleDateString()}.</p>
        <h2>Cancelled Order Details:</h2>
        ${products.map(product => `
          <p>- ${product.name}</p>
        `).join('')}
        <p>Total Amount: ${totalPrice}</p>
        <p>If you have any questions about your cancellation, please contact our customer service.</p>
        <p>Thank you for shopping with us!</p>
      `
    };
    console.log("cancellation mail sent");
    return transporter.sendMail(mailOptions);
};
module.exports = {
    sendOrderConfirmation,
    sendOrderCancellation
};
