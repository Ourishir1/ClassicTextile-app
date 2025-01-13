package com.example.ClassicTextile.modules;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orderItems")
@Data
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(value = AccessLevel.NONE)
    private int id;
    @ManyToOne
    @JsonIgnore
    private  Order order;
    @ManyToOne
    private Fabric fabric;
    private double quantity;
    private double price;

    public OrderItem(Order order, Fabric fabric, double quantity) {
        this.order = order;
        this.fabric = fabric;
        this.quantity = quantity;
        this.price = fabric.getPrice()*quantity;
    }

    public OrderItem(Fabric fabric, double quantity) {
        this.fabric = fabric;
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "order=" + order.getId() +
                ", fabric=" + fabric +
                ", quantity=" + quantity +
                ", price=" + price +
                '}';
    }
}
