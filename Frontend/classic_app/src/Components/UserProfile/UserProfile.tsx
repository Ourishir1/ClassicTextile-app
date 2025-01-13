import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom"; // Use for query params and navigation
import userService from "../../Services/UserService";
import { User } from "../../Models/User";
import { jwtDecode, JwtPayload } from "jwt-decode"; // jwt-decode to decode token
import "./UserProfile.css";
import { useForm } from "react-hook-form";
interface CustomJwtPayload extends JwtPayload {
    userId: string;
  }

export function UserProfile(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams] = useSearchParams();
  const userIdFromParams = parseInt(searchParams.get("userId") || "", 10); // Retrieve from query params
  const navigate = useNavigate();

  const {register,handleSubmit,formState,setValue}=useForm<User>()


  // Decoding the token to get the userId from the token
  const token = localStorage.getItem("token");
  let userIdFromToken: string | undefined;
  if (token) {
    const decodedToken = jwtDecode<CustomJwtPayload>(token); // Decode the token
    userIdFromToken = decodedToken.userId; // Assuming userId is in the token payload
  }

  useEffect(() => {
    // Check if the userId from token matches the userId from URL params
    if (userIdFromToken !== undefined && userIdFromParams !== +userIdFromToken) {
      alert("Unauthorized request");
      navigate("/home"); // Redirect the user to the home page
      return; // Stop further execution
    }

    userService
      .getUserById(userIdFromParams)
      .then((fetchedUser) => {
        setUser(fetchedUser);
        setValue("id",fetchedUser.id)
        setValue("firstName",fetchedUser.firstName)
        setValue("lastName",fetchedUser.lastName)
        setValue("email",fetchedUser.email)
        setValue("phoneNumber",fetchedUser.phoneNumber)
        setValue("isAdmin",fetchedUser.isAdmin)

    
      })
      .catch((err) => alert(err.response?.data || "Error fetching user details"));
  }, [userIdFromParams, userIdFromToken, navigate]);
  
  function updateUser(user:User){
    userService.updateUser(user).then(b=>alert("it worked!")).catch(err=>alert("YOU SUCK !"))
}



  if (!user) {
    return <div className="UserProfile">Loading...</div>;
  }

  return (
    <div className="UserProfile">
      <h1>Your Profile</h1> {/* Add a static heading */}
      <form  onSubmit={handleSubmit(updateUser)}>
        <TextField {...register("firstName")} label="First Name" fullWidth />
        <TextField {...register("lastName")} label="Last Name" fullWidth />
        <TextField {...register("email")} label="Email" type="email" fullWidth />
        <TextField {...register("password")} label="Password" type="password" fullWidth />
        <TextField {...register("phoneNumber")} label="Phone Number" fullWidth />
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </form>

    </div>
  );
}
