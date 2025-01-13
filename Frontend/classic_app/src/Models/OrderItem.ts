import { Fabric } from "./Fabric"
import { Order } from "./Order"

export class OrderItem{
    id:number
    order:Order
    fabric:Fabric
    quantity:number
    price:number
    constructor(id:number,order:Order,fabric:Fabric,quantity:number,price:number){
        this.id=id
        this.order=order
        this.fabric=fabric
        this.quantity=quantity
        this.price=price
    }
}