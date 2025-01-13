export class Fabric{
    id:number
    name:string
    price:number
    image:string
    color:string
    description:string
    category:string
    status:string

    constructor(id:number,name:string,price:number,image:string,color:string,description:string,category:string,status:string){
        this.id=id
        this.name=name
        this.price=price
        this.image=image
        this.color=color
        this.description=description
        this.category=category
        this.status=status
    }

}