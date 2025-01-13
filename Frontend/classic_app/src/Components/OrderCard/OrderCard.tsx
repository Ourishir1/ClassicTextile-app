import React from "react";
import { Order } from "../../Models/Order";
import "./OrderCard.css";
import { OrderStatus } from "../../Models/enums/OrderStatus";

interface OrderCardProps {
  order: Order;
}


export function OrderCard({ order }: OrderCardProps): JSX.Element {

  return (
    <div className="OrderCard">
      <h2>Order #{order.id}</h2>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {order.orderStatus}</p>
      <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
      <p><strong>Total Price:</strong> ₪{order.totalPrice.toFixed(2)}</p>
      <h3>Items:</h3>
      <ul>
        {order.orderItems.map((item, index) => (
          <li key={index}>
            <p><strong>Item:</strong> {item.fabric.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₪{item.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
