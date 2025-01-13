package com.example.ClassicTextile.modules;

import com.example.ClassicTextile.modules.enums.TypeOfCustomer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private int id;
    @Column(unique = true)
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String phoneNumber;
    private TypeOfCustomer typeOfCustomer =TypeOfCustomer.REGULAR;
    private Boolean isAdmin= false;
    @OneToMany(mappedBy = "user",fetch = FetchType.EAGER)
    private List<Order> orders;

    public User(String email, String password, String firstName, String lastName,String phoneNumber) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber=phoneNumber;
    }

}
