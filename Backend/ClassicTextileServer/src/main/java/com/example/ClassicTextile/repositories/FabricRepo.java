package com.example.ClassicTextile.repositories;

import com.example.ClassicTextile.modules.Fabric;
import com.example.ClassicTextile.modules.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FabricRepo extends JpaRepository<Fabric,Integer> {
    List<Fabric> findFabricsByCategory(Category category);
}
