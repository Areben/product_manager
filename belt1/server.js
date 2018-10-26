// Modules
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');



// App
const port = 8000;
const app = express();
const server = app.listen(port, function() {
    console.log(`listening on port ${port}`);
})



// Mongoose
mongoose.connect(
    'mongodb://localhost/belt1',
    { useNewUrlParser: true }
);

const ProductSchema = new mongoose.Schema({
    name: {type: String,
        required: [true,
        "Name is required"],
        minlength: [6,
        "Min Length is 6 characters"]
        },
    price: {type: Number,
        required: [true,
        "Price is required"],
        min: [0,
        "Minimum of 0"]
        },
    quantity: {type: Number,
        required: [true,
        "Quantity is required"],
        min: [0,
        "Minimum of 0"]
        },
}, {timestamps: true });

const Product = mongoose.model(
    "Product", ProductSchema);



// Express
app.use(express.static( __dirname +
    '/public/dist/public'));

app.use(bodyParser.json());



// Routing
const api = "/api/products";

app.get(`${api}`, function(req, res) {
    Product.find({}, function(err, products){
        if (err) {
            res.json({err: err})
        }
        else {
            res.json(products)
        }
    })
})


app.get(`${api}/:id`, function(req, res) {
    console.log("Params ID:", req.params.id);
    Product.findOne({_id: req.params.id}, function(err, product) {
        if (err) {
            res.json({err: err})
        }
        else {
            res.json(product)
        }
    })
})


app.post(`${api}`, function(req, res) {
    console.log(req.body);
    var product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
    })

    product.save(function(err) {
        if(err) {
            res.json({err: err})
        }
        else {
            Product.find({}, function(err, products){
                if (err) {
                    res.json({err: err})
                }
                else {
                    res.json(products)
                }
            })
        }
    })
})


app.put(`${api}/:id`, function(req, res) {
    console.log("what we sent", req.body);
    Product.findOne({_id: req.params.id}, function(err, product) {
        console.log("what we're updating", product);
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;

        product.save(function(err) {
            if(err) {
                res.json({err: err})
            }
            else {
                res.json(product)
            }
        })
    })
})


app.delete(`${api}/:id`, function(req,res) {
    console.log(req.params.id);
    Product.deleteOne({_id: req.params.id}, function(err) {
        if(err) {
            res.json({err: err})
        }
        else {
            res.json({message: "Deletion Succesful"})
        }
    });
})


app.all("*", (req,res,next) => {
    res.sendFile(path.resolve(
        "./public/dist/public/index.html"))
});
