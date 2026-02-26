package org.launchcode.cake_factory_back_end.repositories;

import org.launchcode.cake_factory_back_end.models.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<Cake, Long> {
    //JPA query methods
    List<Cake> findByCategory(Cake.Category category);
    List<Cake> findByCustomizationTrue();
    List<Cake> findByCanWriteMessageTrue();
}
