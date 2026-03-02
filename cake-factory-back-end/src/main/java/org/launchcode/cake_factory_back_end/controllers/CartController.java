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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cart items found for this user");
        }
        return ResponseEntity.ok(cartItems);
    }

    // GET /api/cart/user/{userId}/orders - confirmed orders only
    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        List<Cart> orders = cartRepository
                .findByUser_IdAndStatus(userId, Cart.Status.CONFIRMED);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No orders found for this user");
        }
        return ResponseEntity.ok(orders);
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
        cart.setStatus(Cart.Status.IN_CART); // default status when adding to cart
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
        if (cart.getStatus() != Cart.Status.IN_CART) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only items in cart can be updated");
        }
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
        if (existing.get().getStatus() != Cart.Status.IN_CART) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only items in cart can be removed");
        }
        cartRepository.deleteById(id);
        return ResponseEntity.ok("Item removed from cart");
    }
    // DELETE /api/cart/user/{userId} - clear entire cart
    @Transactional
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository
                .findByUser_IdAndStatus(userId, Cart.Status.IN_CART);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No cart items found for this user");
        }
        cartRepository.deleteByUser_IdAndStatus(userId, Cart.Status.IN_CART);
        return ResponseEntity.ok("Cart cleared successfully");
    }
    // POST /api/cart/checkout/{userId} - checkout
    @Transactional
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<String> checkout(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        List<Cart> cartItems = cartRepository
                .findByUser_IdAndStatus(userId, Cart.Status.IN_CART);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cart is empty");
        }
        //  Just update status to CONFIRMED
        for (Cart cart : cartItems) {
            cart.setStatus(Cart.Status.CONFIRMED);
            cartRepository.save(cart);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Order confirmed! Your delicious cake order is on its way.");
    }

}