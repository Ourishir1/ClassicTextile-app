package com.example.ClassicTextile.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.ClassicTextile.modules.ServerState;
import com.example.ClassicTextile.exceptions.EmailAlreadyExistException;
import com.example.ClassicTextile.exceptions.PasswordIsIncorrectException;
import com.example.ClassicTextile.exceptions.PhoneNumberAlreadyExists;
import com.example.ClassicTextile.exceptions.UserNotFoundException;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private UserService userService;
    private Map<String, ServerState> activeTokens;


    public AuthController(UserService userService, Map<String,ServerState> activeTokens) {
        this.userService = userService;
        this.activeTokens = activeTokens;
    }

    @PostMapping("login")
    public ResponseEntity<String> login(String email,String password) throws UserNotFoundException, PasswordIsIncorrectException {
         User user=userService.login(email,password);
         if(user!=null) {
             String token = createToken(user);
             activeTokens.put(token,new ServerState("CustomerService", LocalDateTime.now()));
             return ResponseEntity.ok(token);
         }
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
    @PostMapping("logout")
    public String logout(String token) throws UserNotFoundException, PasswordIsIncorrectException {
        activeTokens.remove(token);
        return "token has been removed";
    }
    @PostMapping("register")
    public void register(@RequestBody User user) throws PhoneNumberAlreadyExists, EmailAlreadyExistException {
        userService.createUser(user);
    }


    private String createToken(User user) {
        Date expires =new Date();
        expires.setTime(expires.getTime()+1000*60*60);
        return JWT.create()
                .withIssuer("ClassicTextile")
                .withIssuedAt(new Date())
                .withClaim("userId",user.getId())
                .withClaim("firstName",user.getFirstName())
                .withClaim("lastName",user.getLastName())
                .withClaim("isAdmin",user.getIsAdmin())
                .withExpiresAt(expires)
                .sign(Algorithm.none());
    }

}
