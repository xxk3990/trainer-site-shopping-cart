'use strict';
const orderModel = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        user_uuid: DataTypes.UUID,
        order_date: DataTypes.DATEONLY,
        order_total: DataTypes.INTEGER,
        completed: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "orders",
            underscored: true
        }
    )
    return Order;
}

module.exports = {orderModel}