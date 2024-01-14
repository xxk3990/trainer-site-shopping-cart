const product = require('./controllers/products-controller');
const order = require("./controllers/orders-controller")
const items = require("./controllers/orderItems-controller")
const users = require("./controllers/users-controller")
const mid = require("./middleware/verify-auth.js")

const router = (app) => {
    app.post('/login', users.login)
    app.post('/addUser', users.createAccount)
    app.post('/logout', mid.verifyRequestAuth, users.logout)
    app.get('/verify', mid.verifyRequestAuth, mid.verifySession)
    app.get('/products', product.getProducts)
    app.post('/products', mid.verifyRequestAuth, product.addProduct) //admin only
    app.put('/products', mid.verifyRequestAuth, product.updateProduct)
    app.delete('/products', mid.verifyRequestAuth, product.deleteProduct)
    app.get('/orders', mid.verifyRequestAuth, order.userOrders) //this one is for specific users, need another for admin purposes
    //app.get('/allOrders', admin.getAllOrders) not created yet, will do when admin stuff is implemented
    app.post('/orders', mid.verifyRequestAuth, order.createOrder)
    app.put('/orders', mid.verifyRequestAuth, order.submitOrder)
    app.get('/order-items', mid.verifyRequestAuth, items.getOrderItems)
    app.post("/order-items", mid.verifyRequestAuth, items.createOrderItem);
    app.put('/order-items', mid.verifyRequestAuth, items.updateOrderItem);
    app.delete("/order-items", mid.verifyRequestAuth, items.deleteOrderItem)


}

module.exports = router;