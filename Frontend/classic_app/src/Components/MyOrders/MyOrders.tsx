import { useEffect, useState } from "react";
import { Order } from "../../Models/Order";
import "./MyOrders.css";
import orderService from "../../Services/OrderService";
import { useParams, useSearchParams } from "react-router-dom";
import { OrderCard } from "../OrderCard/OrderCard";
import { Grid2 } from "@mui/material";
import { OrderStatus } from "../../Models/enums/OrderStatus";
interface CustomJwtPayload {
    tokenUserId: number;
  }

export function MyOrders(): JSX.Element {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchParams] = useSearchParams();
    const userIdFromParams = parseInt(searchParams.get("userId") || "", 10); // Retrieve from query params
    

    useEffect(()=> {
        orderService.getMyOrders(userIdFromParams)
        .then(result => setOrders(result))
        .catch(err => console.log(err.response.data))
    },[])

    

    
    return (
        <div className="MyOrders">
            <h1>My Orders</h1>

            <Grid2 display={"flex"} flexWrap={"wrap"}>
                {orders.filter(order=>order.orderStatus!==OrderStatus.PENDING).map(order=><OrderCard order={order} key={order.id}/>)}
            </Grid2>
        </div>
    );
}
