package com.example.ClassicTextile.modules;

import com.example.ClassicTextile.modules.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Orders")
@Data
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(value = AccessLevel.NONE)
    private int id;
    @ManyToOne
    @JsonIgnore
    private User user;
    private LocalDate orderDate;
    private double totalPrice;
    private OrderStatus orderStatus=OrderStatus.PENDING;
    private String shippingAddress;
    @OneToMany(mappedBy = "order",fetch = FetchType.EAGER , orphanRemoval = true)
    private List<OrderItem> orderItems;

    public Order(User user, LocalDate orderDate, double totalPrice, String shippingAddress, List<OrderItem> orderItems) {
        this.user = user;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.shippingAddress = shippingAddress;
        this.orderItems = orderItems;
    }

    public Order(User user, LocalDate orderDate, List<OrderItem> orderItems) {
        this.user = user;
        this.orderDate = orderDate;
        this.orderItems = orderItems;
    }

    @Override
    public String toString() {
        return "Order{" +
                "user=" + user.getId() +
                ", orderDate=" + orderDate +
                ", totalPrice=" + totalPrice +
                ", orderStatus=" + orderStatus +
                ", shippingAddress='" + shippingAddress + '\'' +
                ", orderItems=" + orderItems +
                '}';
    }
}
