const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51ODiD8SJmdjx949oeLXWiCzgnS2TTVTwHN7sUNxoDmcgCoHvxGydBeqtTgxVrenlZlsNcPHquFI2HVADmS6CK85Q00P9A0pfGn")
require("dotenv").config()

app.use(express.json());
app.use(cors());

app.get("/", (req, res)=> res.send("server running"))

app.post("/api/create-checkout-session", async(req,res)=>{
  const {products} = req.body;

  const lineItems = products.map((product)=>({
    price_data:{
      currency:"inr",
      product_data:{
        name:product.name
      },
      unit_amount: parseFloat(product.price.replace(/[^0-9.]/g, '')) * 100,
    },
    quantity:product.quantity
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items: lineItems,
    mode:"payment",
    success_url:"https://medic-pharamcy-app.vercel.app/success",
    cancel_url:"https://medic-pharamcy-app.vercel.app/cancel",
  })

  res.json({id:session.id})
})

const port = process.env.PORT || 8000
app.listen(port, ()=>{
  console.log("server started " + "on " + port)
})
