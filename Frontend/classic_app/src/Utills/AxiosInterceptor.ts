import { Token } from "@mui/icons-material"
import axios from "axios"
import { config } from "process"

export const addToken=()=>{
    axios.interceptors.request.use(config=>{
        const token =localStorage.getItem("token");
        if(token)
            config.headers.Authorization ="Bearer "+ token;
        return config
        
    })
}