package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cart;
import org.launchcode.cake_factory_back_end.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    // GET all cart items by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUser(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }

    // POST add item to cart
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Cart cart) {
        Cart saved = cartRepository.save(cart);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update cart item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @RequestBody Cart updatedCart) {
        boolean exists = cartRepository.existsById(id);
        if (!exists) {
            return ResponseEntity.notFound().build();
        }
        Cart cart = cartRepository.findById(id).get();
        cart.setQuantity(updatedCart.getQuantity());
        cart.setSelectedSize(updatedCart.getSelectedSize());
        cart.setSelectedFlavour(updatedCart.getSelectedFlavour());
        cart.setSelectedFilling(updatedCart.getSelectedFilling());
        cart.setMessage(updatedCart.getMessage());
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    // DELETE single cart item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) {
        if (!cartRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cartRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}