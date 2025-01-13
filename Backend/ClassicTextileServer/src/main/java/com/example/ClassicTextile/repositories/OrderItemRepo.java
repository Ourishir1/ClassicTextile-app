package com.example.ClassicTextile.repositories;

import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.OrderItem;
import com.example.ClassicTextile.modules.User;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,Integer> {
    List<OrderItem> findOrderItemByFabricId(int fabricId);
    void deleteByFabricId(int fabricId);
    OrderItem findByFabricId(int fabricId);
}
