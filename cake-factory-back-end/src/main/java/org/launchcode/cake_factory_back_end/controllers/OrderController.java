package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cart;
import org.launchcode.cake_factory_back_end.models.Order;
import org.launchcode.cake_factory_back_end.repositories.CartRepository;
import org.launchcode.cake_factory_back_end.repositories.OrderRepository;
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

    // POST /api/orders/checkout/{userId}
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<String> checkout(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cart is empty");
        }
        for (Cart cart : cartItems) {
            Order order = new Order();
            order.setUserId(userId);
            order.setCakeId(cart.getCakeId());
            order.setQuantity(cart.getQuantity());
            order.setSelectedSize(cart.getSelectedSize());
            order.setSelectedFlavour(cart.getSelectedFlavour());
            order.setSelectedFilling(cart.getSelectedFilling());
            order.setMessage(cart.getMessage());
            order.setPrice(cart.getPrice());
            order.setStatus(Order.Status.CONFIRMED);
            orderRepository.save(order);
        }
        cartRepository.deleteByUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Order confirmed! Your delicious cake order is on its way.");
    }

    // GET /api/orders/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(orders);
    }

    // DELETE /api/orders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        Optional<Order> existing = orderRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        Order order = existing.get();
        if (order.getStatus() != Order.Status.CONFIRMED) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only confirmed orders can be cancelled");
        }
        order.setStatus(Order.Status.CANCELLED);
        orderRepository.save(order);
        return ResponseEntity.ok("Order cancelled successfully");
    }
}