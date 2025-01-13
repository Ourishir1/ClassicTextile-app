import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { Order } from "../../Models/Order";
import orderService from "../../Services/OrderService";
import { OrderCard } from "../OrderCard/OrderCard";
import { jwtDecode, JwtPayload } from "jwt-decode";
import "./CheckOut.css";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export function CheckOut(): JSX.Element {
  const [order, setOrder] = useState<Order | null>(null); // Use null to signify no order yet
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Order>();

  const userIdFromParams = parseInt(searchParams.get("userId") || "", 10);

  const token = localStorage.getItem("token");
  let userIdFromToken: string | undefined;
  if (token) {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    userIdFromToken = decodedToken.userId;
  }

  useEffect(() => {
    // Authorization check
    if (userIdFromToken !== undefined && userIdFromParams !== +userIdFromToken) {
      alert("Unauthorized request");
      navigate("/home");
      return;
    }

    // Fetch the pending order
    orderService
      .getPendingOrder(userIdFromParams)
      .then((result) => {
        setOrder(result); // Update the order state
        setValue("id", result.id);
        setValue("shippingAddress", result.shippingAddress || "");
      })
      .catch((err) => console.error(err.response?.data || "Error fetching orders"));
  }, [userIdFromParams, userIdFromToken, navigate, setValue]);

  function makePurchase(data: Partial<Order>) {
    if (order) {
      const updatedOrder = { ...order, ...data }; // Merge updated shipping address into the existing order
      orderService
        .makePurchase(updatedOrder)
        .then(() =>  {alert("Purchase successful!"); navigate("/home"); window.location.reload();})
        .catch((err) => alert("Error completing please add adress"))

        

    }
  }

  // Show a loading message until the order is fetched
  if (!order) {
    return <div className="CheckOut">Loading order...</div>;
  }

  return (
    <div className="CheckOut">
       <h2>Order #{order.id}</h2>
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
      <form onSubmit={handleSubmit(makePurchase)} className="ShippingForm">
        <TextField
          {...register("shippingAddress")}
          label="Shipping Address"
          defaultValue={order.shippingAddress}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Purchase
        </Button>
      </form>
    </div>
  );
}
