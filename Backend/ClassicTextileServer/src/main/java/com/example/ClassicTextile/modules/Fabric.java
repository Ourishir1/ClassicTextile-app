package com.example.ClassicTextile.modules;

import com.example.ClassicTextile.modules.enums.Color;
import com.example.ClassicTextile.modules.enums.Status;
import com.example.ClassicTextile.modules.enums.Category;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "Fabric")
@Data
@NoArgsConstructor
@ToString
public class Fabric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private int id;
    private String name;
    private double price;
    @Column(columnDefinition="varchar(255)")
    private String image;
    private Color color;
    private String description;
    private Category category;
    private Status status = Status.IN_STOCK;

    public Fabric( String name, double price, String image, Color color, String description, Category category) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.color = color;
        this.description = description;
        this.category =category ;
    }

}
