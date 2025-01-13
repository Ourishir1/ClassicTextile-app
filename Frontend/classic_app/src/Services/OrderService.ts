import axios from "axios";
import { OrderItem } from "../Models/OrderItem";
import { Order } from "../Models/Order";
import { OrderStatus } from "../Models/enums/OrderStatus";

class OrderService {
  async getPendingOrder(userId: number): Promise<Order> {
    return (await axios.get<Order>(`http://localhost:8080/order/pendingOrder?userId=${userId}`)).data;
  }

  // Modify this method to correctly send the OrderItem to the backend
  async updateOrderQuantity(orderItem: OrderItem): Promise<Order> {
    return (await axios.post<Order>(
      "http://localhost:8080/order/updateOrderItem", 
      orderItem
    )).data;
  }

  async addToCart(fabricId:number,quantity:number,userId:number) {
    await axios.post(`http://localhost:8080/order/item?userId=${userId}&quantity=${quantity}&fabricId=${fabricId}`);
  }

  async getDeleteOrderItem(itemId: number) {
    await axios.delete(`http://localhost:8080/order/item?itemId=${itemId}`);
  }
  async getMyOrders(userId: number): Promise<Order[]> {
    return (await axios.get<Order[]>(`http://localhost:8080/order/myOrders?userId=${userId}`)).data;
  }
  async makePurchase(order:Order):Promise<Order> {
    return (await axios.post<Order>(`http://localhost:8080/order/purchase`,order)).data;

}
async getAllOrders(): Promise<Order[]> {
  return (await axios.get<Order[]>(`http://localhost:8080/order/allOrders`)).data;
}
async updateOrder(orderId:number,orderStatus:OrderStatus){
  return (await axios.put(`http://localhost:8080/order/updateOrder?orderId=${orderId}&orderStatus=${orderStatus}`));

}


}

const orderService = new OrderService();
export default orderService;
