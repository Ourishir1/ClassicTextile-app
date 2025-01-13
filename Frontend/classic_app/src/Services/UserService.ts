import axios from "axios";
import { User } from "../Models/User";

class UserService{
    async getUserById(userId:number):Promise<User> {
        return (await axios.get<User>(`http://localhost:8080/user/oneUser?userId=${userId}`)).data;
    }
    async updateUser(user:User):Promise<User> {
        return (await axios.put<User>(`http://localhost:8080/user/oneUser`,user)).data;

    }
    async getAllUsers():Promise<User[]>{
        return (await axios.get<User[]>(`http://localhost:8080/user/all`)).data;
    }
    async deleteUserById(userId:number) {
        return (await axios.delete(`http://localhost:8080/user/oneUser?userId=${userId}`));
    }
    

    

}
const userService = new UserService();
export default userService ;
