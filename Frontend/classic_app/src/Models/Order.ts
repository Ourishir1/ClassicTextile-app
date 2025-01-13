import { OrderStatus } from "./enums/OrderStatus"
import { OrderItem } from "./OrderItem"
import { User } from "./User"

export class Order{
    id:number
    user:User
    orderDate:Date
    totalPrice:number
    orderStatus:OrderStatus
    shippingAddress:string
    orderItems:OrderItem[]

    constructor(id:number,user:User,orderDate:Date,totalPrice:number,orderStatus:OrderStatus,shippingAddress:string,orderItems:OrderItem[]){
            this.id=id
            this.user=user
            this.totalPrice=totalPrice
            this.orderDate=orderDate
            this.orderStatus=orderStatus
            this.shippingAddress=shippingAddress
            this.orderItems=orderItems
        }
}