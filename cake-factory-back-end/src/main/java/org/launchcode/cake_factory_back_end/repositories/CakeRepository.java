package org.launchcode.cake_factory_back_end.repositories;

import org.launchcode.cake_factory_back_end.models.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<Cake, Long> {
    // Find cakes by category
    List<Cake> findByCategory(Cake.Category category);
    // Find cakes that are customizable
    List<Cake> findByCustomizationTrue();
    // Find cakes by name
    List<Cake> findByNameContainingIgnoreCase(String name);
}