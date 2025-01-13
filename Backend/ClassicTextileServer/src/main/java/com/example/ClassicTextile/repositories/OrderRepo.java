package com.example.ClassicTextile.repositories;

import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    Order findOrderByUserIdAndOrderStatus(int userId, OrderStatus orderStatus);
    List<Order>findOrdersByUser(User user);
    List<Order> findOrdersByOrderStatus(OrderStatus orderStatus);




}
