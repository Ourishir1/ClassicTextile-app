package com.example.ClassicTextile.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.ClassicTextile.exceptions.EmailAlreadyExistException;
import com.example.ClassicTextile.exceptions.UserNotFoundException;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.services.AdminService;
import com.example.ClassicTextile.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private AdminService adminService;

    public UserController(AdminService adminService) {
        this.adminService = adminService;
    }
    @GetMapping("/oneUser")
    public  ResponseEntity<?> getOneUser( int userId, @RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        int tokenUserId = decodedJWT.getClaim("userId").asInt();
        if (userId !=tokenUserId ) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access these orders");
        }
        return ResponseEntity.ok( adminService.getUserById(userId));
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(@RequestHeader(name = "authorization")String token){
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        // Check if the user is an admin
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access all users");
        }
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    @PutMapping("/oneUser")
    public ResponseEntity<?> updateUser(@RequestBody User user,@RequestHeader(name = "authorization")String token) throws UserNotFoundException, EmailAlreadyExistException {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        int tokenUserId = decodedJWT.getClaim("userId").asInt();
        if (user.getId() !=tokenUserId && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this user");
        }

        return ResponseEntity.ok( adminService.updateUser(user));
    }
    @DeleteMapping("/oneUser")
    public ResponseEntity<String> deleteUser(int userId,@RequestHeader(name = "authorization")String token) throws UserNotFoundException {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        // Check if the user is an admin
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access all users");
        }
         adminService.deleteUser(userId);
        return ResponseEntity.ok("User was deleted");
    }



}
