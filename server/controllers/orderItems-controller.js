const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getOrderItems = async (req, res) => {
    const order = await models.Order.findOne({
        where: {
            'uuid': req.query.orderID,
            "user_uuid": req.query.userID
        }
    })
    const orderItems = await models.Order_Item.findAll({
        where: {
            'order_uuid': req.query.orderID
        },
        raw: true
    })
    if (orderItems.length !== 0) {
        const cart = [...orderItems]; //create a local copy of the DB array before adding stuff
        for (let i = 0; i < cart.length; i++) {
            const matchingProduct = await models.Product.findOne({
                where: {
                    'uuid': cart[i].product_uuid
                }
            })
            //add product fields to array sent to FE
            cart[i].product_name = matchingProduct.product_name,
            cart[i].image_url = matchingProduct.image_url
            cart[i].item_total = matchingProduct.price * cart[i].quantity;
        }
        const total = cart.map(x => x.item_total).reduce((acc, val) => {
            return acc + val;
        })
    //set order total in DB to the sum of the item prices to make sure it stays the same # as the items sum
        order.order_total = total;
        await order.save();
        return res.json({
            cart_items: cart,
            cart_total: total
        })
    } else {
        return res.send([])
    }
}

const createOrderItem = async (req, res) => {
    const matchingProduct = await models.Product.findOne({
        where: {
            'uuid': req.body.product_uuid
        }
    })
    const newOrderItem = {
        //uuid, order_uuid, product_uuid, quantity
        uuid: uuidv4(),
        order_uuid: req.body.order_uuid,
        quantity: req.body.quantity,
        product_uuid: req.body.product_uuid,
    }
    const matchingOrder = await models.Order.findOne({
        where: {
            'uuid': req.body.order_uuid
        }
    })
    try {
        models.sequelize.transaction(async () => {
            await models.Order_Item.create(newOrderItem)
            //upate order total when new item is added!
            matchingOrder.order_total += matchingProduct.price
            await matchingOrder.save();
            return res.status(200).send({
                order_uuid: newOrderItem.order_uuid
            });
        })
    } catch {
        return res.status(400).send();
    }

}

const updateOrderItem = async (req, res, next) => {
    const itemToUpdate = await models.Order_Item.findOne({
        where: {
            "uuid": req.body.item_uuid
        }
    })
    if (!itemToUpdate) {
        return res.status(404).send() //send "not found" status code to FE
    } else {
        try {
            const matchingProduct = await models.Product.findOne({
                where: {
                    'uuid': itemToUpdate.product_uuid
                }
            })
            const matchingOrder = await models.Order.findOne({
                where: {
                    'uuid': itemToUpdate.order_uuid
                }
            })
            //if incoming quantity is higher than current, increase order_total in DB
            if (req.body.quantity > itemToUpdate.quantity) {
                itemToUpdate.quantity = req.body.quantity;
                console.log(itemToUpdate)
                //update corresponding order total
                matchingOrder.order_total = matchingOrder.order_total + matchingProduct.price;
                await itemToUpdate.save();
                await matchingOrder.save();
                return res.status(200).send()
            } else { //if not, decrease.
                itemToUpdate.quantity = req.body.quantity;
                matchingOrder.order_total = matchingOrder.order_total - matchingProduct.price;
                await itemToUpdate.save();
                await matchingOrder.save();
                return res.status(200).send()
            }
        } catch (error) {
            console.log("PUT error: ", error)
            res.status(304).send() //send not modified here if it fails
            next(error)
        }
    }


}

const deleteOrderItem = async (req, res) => {
    const matchingOrder = await models.Order.findOne({
        where: {
            'uuid': req.query.order
        }
    })
    const allItemsInOrder = await models.Order_Item.findAll({
        where: {
            'order_uuid': req.query.order
        }
    })
    const matchingProduct = await models.Product.findOne({
        where: {
            'uuid': req.query.product
        }
    })
    try {
        models.sequelize.transaction(async () => {
            
            await models.Order_Item.destroy({
                where: {
                    'uuid': req.query.item
                }
            });
            //if length of order_items is 1 after deletion, remove order too
            if (allItemsInOrder.length === 1) {
                await models.Order.destroy({
                    where: {
                        'uuid': req.query.order
                    }
                })
                return res.status(200).send()
            } else {
                //if not, delete and only decrease order total.
                //subtract from order total if order_item is deleted
                matchingOrder.order_total -= (matchingProduct.price * req.query.quantity);
                await matchingOrder.save();
                return res.status(200).send()
            }
            
        })
    } catch {
        return res.status(400).send()
    }
}



module.exports = {
    getOrderItems,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
}