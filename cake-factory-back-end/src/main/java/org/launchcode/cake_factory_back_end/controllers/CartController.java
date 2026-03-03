package org.launchcode.cake_factory_back_end.controllers;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.launchcode.cake_factory_back_end.dto.CartDTO;
import org.launchcode.cake_factory_back_end.models.Cake;
import org.launchcode.cake_factory_back_end.models.Cart;
import org.launchcode.cake_factory_back_end.models.User;
import org.launchcode.cake_factory_back_end.repositories.CakeRepository;
import org.launchcode.cake_factory_back_end.repositories.CartRepository;
import org.launchcode.cake_factory_back_end.repositories.UserRepository;
import org.launchcode.cake_factory_back_end.service.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;


import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository; // For fetching User object
    @Autowired
    private CakeRepository cakeRepository; // For fetching Cake object
    @Autowired
    private PriceService priceService; // For calculating price based on selections

    private CartDTO convertToDTO(Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                cart.getCake().getId(),
                cart.getCake().getName(),
                cart.getCake().getImage_id(),
                cart.getQuantity(),
                cart.getSelectedSize(),
                cart.getSelectedFlavour(),
                cart.getSelectedFilling(),
                cart.getMessage(),
                cart.getPrice(),
                cart.getStatus().toString()
        );
    }

    // GET all cart items by user
    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<?> getCartByUser(@PathVariable Long userId) throws NoResourceFoundException {
        List<Cart> cartItems = cartRepository.findByUser_IdAndStatus(userId, Cart.Status.IN_CART);

        //calculate the grand Total for all items in the cart
        double grandTotal = cartItems.stream().mapToDouble(Cart::getPrice).sum();

        if (cartItems.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.GET, "/api/cart/user/" + userId,"No items found in cart");
        }else {
            List<CartDTO> dtoList = cartItems.stream().map(this::convertToDTO).collect(Collectors.toList());
            Map<String, Object> response = new HashMap<>();
            response.put("cartItems", dtoList);
            response.put("grandTotal", grandTotal);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    // GET all confirmed orders by user
    @GetMapping(value = "/user/{userId}/orders")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) throws NoResourceFoundException {
        List<Cart> orders = cartRepository.findByUser_IdAndStatus(userId, Cart.Status.CONFIRMED);
        if (orders.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.GET, "/api/cart/user/" + userId + "/orders", "No orders found");
        } else {
            List<CartDTO> orderDTOs = orders.stream().map(this::convertToDTO).collect(Collectors.toList());
            return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
        }
    }

    // Add Cart Item - POST /api/cart/add
    @PostMapping(value = "/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartDTO cartData) throws NoResourceFoundException {
         // Calculate price based on cake and customizations
        if (cartData.getUserId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findById(cartData.getUserId())
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.POST, "/api/cart/add", "User ID not found"));

        Cake cake = cakeRepository.findById(cartData.getCakeId())
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.POST, "/api/cart/add", "Cake ID not found"));
        if (user == null || cake == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        double validatedPrice= priceService.calculateTotalItemPrice(
                cake,
                cartData.getSelectedSize(),
                cartData.getSelectedFilling(),
                cartData.getQuantity());
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCake(cake);
        cart.setQuantity(cartData.getQuantity());
        cart.setSelectedSize(cartData.getSelectedSize());
        cart.setSelectedFlavour(cartData.getSelectedFlavour());
        cart.setSelectedFilling(cartData.getSelectedFilling());
        cart.setMessage(cartData.getMessage());
        cart.setPrice(validatedPrice);
        cart.setStatus(Cart.Status.IN_CART);

        cartRepository.save(cart);

        return new ResponseEntity<>(convertToDTO(cart), HttpStatus.CREATED);
    }
    // Update Cart Item - PUT /api/cart/{id}
    @PutMapping(value = "/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @Valid @RequestBody CartDTO updatedCartData) throws NoResourceFoundException {

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.PUT, "/api/cart/" + id, "Cart item not found"));
        if (cart == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (cart.getStatus() != Cart.Status.IN_CART) {
            return new ResponseEntity<>("Only items in cart can be updated", HttpStatus.BAD_REQUEST);
        }
        // Re-calculate the price based on new quantity/options
        double newValidatedPrice = priceService.calculateTotalItemPrice(
                cart.getCake(),
                updatedCartData.getSelectedSize(),
                updatedCartData.getSelectedFilling(),
                updatedCartData.getQuantity()
        );

        cart.setQuantity(updatedCartData.getQuantity());
        cart.setSelectedSize(updatedCartData.getSelectedSize());
        cart.setSelectedFlavour(updatedCartData.getSelectedFlavour());
        cart.setSelectedFilling(updatedCartData.getSelectedFilling());
        cart.setMessage(updatedCartData.getMessage());
        cart.setPrice(newValidatedPrice);

        cartRepository.save(cart);
        return new ResponseEntity<>(convertToDTO(cart), HttpStatus.OK);
    }
    // Delete Single Cart Item - DELETE /api/cart/{id}
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) throws NoResourceFoundException {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.DELETE, "/api/cart/" + id,"Cart item not found"));

        if (cart.getStatus() != Cart.Status.IN_CART) {
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }

        cartRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    //Clear Cart - DELETE /api/cart/user/{userId}
    @Transactional
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) throws NoResourceFoundException {
        List<Cart> cartItems = cartRepository.findByUser_IdAndStatus(userId, Cart.Status.IN_CART);

        if (cartItems.isEmpty()) {
            throw new NoResourceFoundException(HttpMethod.DELETE, "/api/cart/user/" + userId, "Cart is already empty");
        } else {
            cartRepository.deleteByUser_IdAndStatus(userId, Cart.Status.IN_CART);
            return new ResponseEntity<>( HttpStatus.NO_CONTENT);
        }
    }
    //Checkout - POST /api/cart/checkout/{userId}
    @Transactional
    @PostMapping(value = "/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable Long userId) throws NoResourceFoundException {
        userRepository.findById(userId)
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.POST, "/api/cart/checkout/" + userId, "User not found"));

        List<Cart> cartItems = cartRepository.findByUser_IdAndStatus(userId, Cart.Status.IN_CART);

        if (cartItems.isEmpty()) {
            return new ResponseEntity<>("Cart is empty", HttpStatus.BAD_REQUEST);
        }

        for (Cart cart : cartItems) {
            cart.setStatus(Cart.Status.CONFIRMED);
        }
        cartRepository.saveAll(cartItems);

        // Convert the confirmed items to DTOs for the response
        List<CartDTO> confirmedOrderDTOs = cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Return the list of DTOs in the standard ResponseEntity format
        return new ResponseEntity<>(confirmedOrderDTOs, HttpStatus.CREATED);
}
}
