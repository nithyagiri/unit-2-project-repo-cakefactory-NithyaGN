package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cart;
import org.launchcode.cake_factory_back_end.models.Order;
import org.launchcode.cake_factory_back_end.models.User;
import org.launchcode.cake_factory_back_end.repositories.CartRepository;
import org.launchcode.cake_factory_back_end.repositories.OrderRepository;
import org.launchcode.cake_factory_back_end.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;      // needed to fetch User object

    // POST /api/orders/checkout/{userId}
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<String> checkout(@PathVariable Long userId) {
        // fetch User object
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<Cart> cartItems = cartRepository.findByUser_Id(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cart is empty");
        }
        //Convert each cart item to an order
        for (Cart cart : cartItems) {
            Order order = new Order();
            // set User and Cake objects instead of IDs
            order.setUser(user.get());
            order.setCake(cart.getCake());          // get Cake object directly from cart
            order.setQuantity(cart.getQuantity());
            order.setSelectedSize(cart.getSelectedSize());
            order.setSelectedFlavour(cart.getSelectedFlavour());
            order.setSelectedFilling(cart.getSelectedFilling());
            order.setMessage(cart.getMessage());
            order.setPrice(cart.getPrice());
            order.setStatus(Order.Status.CONFIRMED);
            orderRepository.save(order);
        }
        // Clear the cart after checkout
        cartRepository.deleteByUser_Id(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Order confirmed! Your delicious cake order is on its way.");
    }
}

