import { Card, Typography, MenuItem, Button, TextField } from "@mui/material";
import { useState } from "react";
import { OrderItem } from "../../../Models/OrderItem";
import orderService from "../../../Services/OrderService";
import "./CartItem.css";
import { Order } from "../../../Models/Order";
import { jwtDecode } from "jwt-decode";

interface CartItemProps {
  orderItem: OrderItem;
  onOrderUpdate: (updatedOrder: Order) => void;
  orderId: number;
}

interface CustomJwtPayload {
  userId: number;
}

export function CartItem({ orderItem, onOrderUpdate, orderId }: CartItemProps): JSX.Element {
  const [quantity, setQuantity] = useState(orderItem.quantity);

  // Decode the user ID from the token
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<CustomJwtPayload>(token).userId : null;

  const handleQuantityChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
      try {
        const updatedOrder = await orderService.updateOrderQuantity({ ...orderItem, quantity: newQuantity });
        onOrderUpdate(updatedOrder); // Update the parent component's order state
      } catch (error) {
        console.error("Failed to update order quantity:", error);
      }
    }
  };
  const handleDeleteItem = async () => {
    if (!userId) {
      console.error("User ID not found in token");
      return;
    }

    try {
      await orderService.getDeleteOrderItem(orderItem.id); // Call the delete API
      const updatedOrder = await orderService.getPendingOrder(userId); // Fetch updated order using userId
      console.log("Updated order after deletion:", updatedOrder);
      onOrderUpdate(updatedOrder); // Update the parent component's order state
    } catch (error) {
      console.error("Failed to delete order item:", error);
    }
  };

  return (
    <MenuItem className="CartItem">
      <Card className="cart-item-card">
        <img
          src={orderItem.fabric.image}
          alt={orderItem.fabric.name}
          className="cart-item-image"
        />
        <div className="cart-item-details">
          <Typography variant="h6">{orderItem.fabric.name}</Typography>
          <Typography variant="body2">Price: ₪{orderItem.fabric.price}</Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="cart-item-quantity"
          />
          <Typography variant="body1">
            Total: ₪{(quantity * orderItem.fabric.price).toFixed(2)}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteItem}
            className="delete-item-button"
          >
            Delete
          </Button>
        </div>
      </Card>
    </MenuItem>
  );
}
