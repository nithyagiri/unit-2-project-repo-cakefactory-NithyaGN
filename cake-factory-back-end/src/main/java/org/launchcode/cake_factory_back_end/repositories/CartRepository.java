package org.launchcode.cake_factory_back_end.repositories;

import jakarta.transaction.Transactional;
import org.launchcode.cake_factory_back_end.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser_Id(Long userId);
    @Transactional
    void deleteByUser_Id(Long userId);
}
