// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const stripe = require("stripe")(process.env.STRIPE_API_KEY, {
  apiVersion: "2020-03-02; line_items_beta=v1"
});

// const purchase = {
//   amount: 10000,
//   currency: 'USD',
// };

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));




// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/success", (request, response) => {
  response.sendFile(__dirname + "/views/success.html");
});


app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (request, response) => {
  //   send in shipping info
  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ["afterpay_clearpay"],
    shipping: {
      name: "Jenny Rosen",
      address: {
        line1: "1234 Main Street",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postal_code: "94111"
      }
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 10000,
          product_data: {
            name: "Red Shoes"
          }
        }
      }
    ]
  });

  response.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
