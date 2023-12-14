const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51ODiD8SJmdjx949oeLXWiCzgnS2TTVTwHN7sUNxoDmcgCoHvxGydBeqtTgxVrenlZlsNcPHquFI2HVADmS6CK85Q00P9A0pfGn")

app.use(express.json());
app.use(cors());

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
    success_url:"http://localhost:3001/success",
    cancel_url:"http://localhost:3001/cancel",
  })

  res.json({id:session.id})
})


app.listen(7000, ()=>{
  console.log("server start")
})
