package com.example.ClassicTextile.repositories;

import com.example.ClassicTextile.modules.User;
import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {
    User findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByPassword(String password);
    Boolean existsByPhoneNumber(String phoneNumber);


}
