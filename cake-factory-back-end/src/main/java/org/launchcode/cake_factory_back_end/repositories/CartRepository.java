package org.launchcode.cake_factory_back_end.repositories;

import jakarta.transaction.Transactional;
import org.launchcode.cake_factory_back_end.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    //Get all cart items by user
    List<Cart> findByUser_Id(Long userId);
    //Get IN_CART items by user
    List<Cart> findByUser_IdAndStatus(Long userId, Cart.Status status);
    //find single item by id and status
    Optional<Cart> findByIdAndStatus(Long id, Cart.Status status);
    //Delete IN_CART items by user
    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.user.id = :userId AND c.status = :status")
         void deleteByUser_IdAndStatus(Long userId,Cart.Status status);
}
