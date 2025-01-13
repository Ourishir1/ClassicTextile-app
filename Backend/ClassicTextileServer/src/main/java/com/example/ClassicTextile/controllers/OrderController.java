package com.example.ClassicTextile.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.ClassicTextile.exceptions.*;
import com.example.ClassicTextile.modules.Fabric;
import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.OrderItem;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import com.example.ClassicTextile.services.AdminService;
import com.example.ClassicTextile.services.UserService;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    private UserService userService;
    private AdminService adminService;

    public OrderController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
    }

    @GetMapping("/pendingOrder")
    public Order getPendingOrder(int userId) {
        return userService.getPendingOrder(userId);
    }

    @PostMapping("/updateOrderItem")
    public Order updateOrderItem(@RequestBody OrderItem orderItem) throws OrderItemNotFoundException {
        if (orderItem.getId() == 0) {
            throw new OrderItemNotFoundException("Item ID is required for updating.");
        }

        userService.updateOrderItemQuantity(orderItem);
        return orderItem.getOrder();
    }

    @PostMapping("/item")
    public void addToOrder(int userId, int quantity, int fabricId) throws FabricAlreadyInCartException, QuantityCannotBeZeroException, FabricWasNotFoundException {
        userService.createCart(fabricId, quantity, userId);
    }


    @DeleteMapping("/item")
    public void deleteOrderItem(int itemId) throws OrderItemNotFoundException, OrderNotFoundException {
        userService.deleteOrderItem(itemId);
    }


    @GetMapping("/myOrders")
    public ResponseEntity<?> getMyOrders(@RequestParam int userId, @RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        int tokenUserId = decodedJWT.getClaim("userId").asInt();
        if (userId !=tokenUserId ) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access these orders");
        }
        User user=adminService.getUserById(userId);
        return ResponseEntity.ok(userService.getMyOrders(user));
    }

    @PostMapping("/purchase")
    public void makePurchase(@RequestBody Order order) throws ShippingAdressCannotBeNullException, OrderNotFoundException {
        userService.makePurchase(order);
    }

    @GetMapping("/allOrders")
    public ResponseEntity<?> getAllOrders(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        DecodedJWT decodedJWT = JWT.decode(jwtToken);
        boolean isAdmin = decodedJWT.getClaim("isAdmin").asBoolean();
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access all orders");
        }

        // Return all orders for admins
        return ResponseEntity.ok(adminService.getAllOrders());
    }


    @PutMapping("/updateOrder")
    public void updateOrder(int orderId, OrderStatus orderStatus) throws OrderNotFoundException {
        adminService.updateOrder(orderId,orderStatus);
    }
}


