package com.example.ClassicTextile.threads;

import com.example.ClassicTextile.modules.Order;
import com.example.ClassicTextile.modules.enums.OrderStatus;
import com.example.ClassicTextile.repositories.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
@Configuration
@EnableScheduling
public class Job  {
    @Autowired
    public OrderRepo orderRepo;

    public Job() {
    }

    @Scheduled(cron ="0 12 * * * *")
    @Async
    public void run() {
        System.out.println("Running");
        List<Order> orders = orderRepo.findOrdersByOrderStatus(OrderStatus.PENDING);
        for (Order order : orders) {
            if (order.getOrderDate().isBefore(LocalDate.now().minusDays(14)))
                orderRepo.delete(order);
        }
    }
}