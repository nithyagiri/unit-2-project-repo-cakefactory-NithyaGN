package org.launchcode.cake_factory_back_end.controllers;

import jakarta.transaction.Transactional;
import org.launchcode.cake_factory_back_end.models.Cake;
import org.launchcode.cake_factory_back_end.models.Cart;
import org.launchcode.cake_factory_back_end.models.User;
import org.launchcode.cake_factory_back_end.repositories.CakeRepository;
import org.launchcode.cake_factory_back_end.repositories.CartRepository;
import org.launchcode.cake_factory_back_end.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository; // For fetching User object
    @Autowired
    private CakeRepository cakeRepository; // For fetching Cake object
    // GET all cart items by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUser(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUser_Id(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }

    // POST add item to cart
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Cart cart,
                                       @RequestParam Long userId,
                                       @RequestParam Long cakeId) {
        // fetch User object
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // fetch Cake object
        Optional<Cake> cake = cakeRepository.findById(cakeId);
        if (cake.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cake not found");
        }

        if (cart.getQuantity() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than 0");
        }

        // set objects instead of IDs
        cart.setUser(user.get());
        cart.setCake(cake.get());
        cartRepository.save(cart);
        return ResponseEntity.status(HttpStatus.CREATED).body("Item added to cart successfully"); }

    // PUT update cart item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id,
                                            @RequestBody Cart updatedCart,
                                            @RequestParam (required = false) Long cakeId) {
        Optional<Cart> existing = cartRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }

        Cart cart = existing.get();
        cart.setQuantity(updatedCart.getQuantity());
        cart.setSelectedSize(updatedCart.getSelectedSize());
        cart.setSelectedFlavour(updatedCart.getSelectedFlavour());
        cart.setSelectedFilling(updatedCart.getSelectedFilling());
        cart.setMessage(updatedCart.getMessage());
        cart.setPrice(updatedCart.getPrice());
        // update cake if cakeId is provided
        if (cakeId != null) {
            Optional<Cake> cake = cakeRepository.findById(cakeId);
            if (cake.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cake not found");
            }
            cart.setCake(cake.get());
        }

        cartRepository.save(cart);
        return ResponseEntity.ok("Cart item updated successfully");
    }

    // DELETE single cart item
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) {
        Optional<Cart> existing = cartRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }
        cartRepository.deleteById(id);
        return ResponseEntity.ok("Item removed from cart");
    }

}