
import axios from "axios"
import { User } from "../Models/User";

class AuthService{
    async login(email:string,password:string){
        return((await axios.post(`http://localhost:8080/auth/login?email=${email}&password=${password}`))).data
    }
    async logout(token:string){
        return((await axios.post<string>(`http://localhost:8080/auth/logout?token=${token}`))).data
    }
    async register(user:User){
        return((await axios.post(`http://localhost:8080/auth/register`,user)))
    }


}
const authService = new AuthService();
export default authService;