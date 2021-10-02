const express= require("express")

const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser= require('body-parser')
const exphbs = require('express-handlebars')

const app =express()

//Handlebar Middlebars
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

console.log(keys.stripeSecretKey);
//Bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//Static folder
app.use(express.static(`${__dirname}/public`))

const port = process.env.PORT || 5000;

const YOUR_DOMAIN = keys.your_domain;
const herokup=`https://guarded-headland-72288.herokuapp`;

//INDEX route
app.get('/', (req,res) => {
    res.render('index',{
        stripePublishableKey:keys.stripePublishableKey,
    });
})
// stripe.customers.create({
//   email: 'customer@example.com',
// })
//   .then(customer => console.log(customer.id))
//   .catch(error => console.error(error));


//PREBUILT Stripe
app.post('/create-checkout-session', async (req, res) => {
    console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1JgAJdSAJHkEbOWARkXjk6me',
          quantity: 1,
        },
      ],
      payment_method_types: [
        'card',
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url:  `${YOUR_DOMAIN}/cancel`,
    });
    res.redirect(303, session.url)
  });

  app.get('/success',(req,res) => {
    res.render('success');
  })
  app.get('/cancel',(req,res) => {
    res.render('cancel');
})

app.listen(port, () => {
    console.log(`Server at ${port}`);
})