import { Fabric } from "../Models/Fabric";
import axios from "axios"

class FabricService{
    async getAllFabrics(){
        return(await axios.get<Fabric[]>(`http://localhost:8080/fabric/allFabrics`)).data
    }
    async getFabricByCategory(category:String){
        return(await axios.get<Fabric[]>(`http://localhost:8080/fabric/category/${category}`)).data
    }
    async addFabric(fabric:Fabric){
        return(await axios.post(`http://localhost:8080/fabric/addFabric`,fabric))
    }
    async getOneFabric(id:number){
        return(await axios.get<Fabric>(`http://localhost:8080/fabric/oneFabric?id=${id}`)).data
    }
    async updateFabric(fabric:Fabric){
        return(await axios.put(`http://localhost:8080/fabric/oneFabric`,fabric))
    }
    async deleteFabric(id: number) {
        return await axios.delete(`http://localhost:8080/fabric?id=${id}`);
    }
    


}
const fabricService = new FabricService();
export default fabricService;