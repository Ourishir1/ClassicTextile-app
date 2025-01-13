import { TypeOfCustomer } from "./enums/TypeOfCustomer"
import { Order } from "./Order"

export class User{
    id:number
    email:string
    password:string
    firstName:string
    lastName:string
    phoneNumber:string
    typeOfCustomer:TypeOfCustomer
    isAdmin:Boolean
    orders:Order[]
    constructor( id:number, email:string,password:string,firstName:string,lastName:string,phoneNumber:string,typeOfCustomer:TypeOfCustomer,isAdmin:Boolean,orders:Order[]){
        this.id=id
        this.email=email
        this.password=password
        this.firstName=firstName
        this.lastName=lastName
        this.phoneNumber=phoneNumber
        this.typeOfCustomer=typeOfCustomer
        this.isAdmin=isAdmin
        this.orders=orders
    }
    
}