import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../Models/User";
import "./Register_Page.css";
import authService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";

export function Register_Page(): JSX.Element {
  const { register, handleSubmit, setValue } = useForm<User>();
  const navigate= useNavigate();

  const onSubmit = (data: User) => {
    // Handle form submission
    authService
    .register(data)
    .then(() => {(alert("you have been registered!")); 
      navigate('/')
    })
    .catch((err) => alert("Error adding user!"));
    console.log(data);
  };

  return (
    <div className="Register_Page">
      <div id="left-container">
        <h1 id="classicTextileText">
          Welcome to
          <br />
          <span>ClassicTextile.</span>
        </h1>
        <h3>Please create an account before you make a purchase.</h3>
        <img
          src={require('/Users/ourishirkani/JS/React/classic_app/src/Images/ClassicLogo.png')}
          alt="classicLogo"
          id="classicLogo"
        />
      </div>
      <div id="right-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} id="signupForm">
          <input
            type="text"
            placeholder="First Name"
            id="firstName"
            className="formInput"
            {...register("firstName")}
          />
          <input
            type="text"
            placeholder="Last Name"
            id="lastName"
            className="formInput"
            {...register("lastName")}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="formInput"
            {...register("email")}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="formInput"
            {...register("password")}
          />
          <input
            type="text"
            placeholder="Phone Number"
            id="phoneNumber"
            className="formInput"
            {...register("phoneNumber")}
          />
          <button className="btn-1" type="submit">
            <div className="original">Signup</div>
            <div className="letters">
              <span>S</span>
              <span>I</span>
              <span>G</span>
              <span>N</span>
              <span>U</span>
              <span>P</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
