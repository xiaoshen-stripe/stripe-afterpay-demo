// client-side js, loaded by index.html
// run by the browser each time the page is loaded

var stripe = Stripe("pk_test_TFBIAgNRPxE5MnaBSp00w86Y00xvsJMCHF", {
  betas: ["afterpay_clearpay_pm_beta_1"]
});

// console.log("hello world :o");

// define variables that reference elements on our page
const dreamsForm = document.querySelector("form");

var accountForm = document.getElementById("afterpay-form");
accountForm.addEventListener("submit", function(event) {
  event.preventDefault();
  // createBankAccount().then(createAccount);
  createPaymetIntent();
});

async function createPaymetIntent() {
  return fetch(`/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(async res => {
    let pi_secret = res.clientSecret;
      console.log("I'm here!", res);
      const { error } = await stripe.confirmAfterpayClearpayPayment(
        pi_secret,
        {
          payment_method: {
            billing_details: {
              email: "jenny@rosen.com",
              name: "Jenny Rosen",
              address: {
                line1: "1234 Main Street",
                city: "San Francisco",
                state: "CA",
                country: "US",
                postal_code: "94111"
              }
            }
          },
          return_url: "https://stripe-afterpay-demo.glitch.me/success"
        }
      );
    });
}
