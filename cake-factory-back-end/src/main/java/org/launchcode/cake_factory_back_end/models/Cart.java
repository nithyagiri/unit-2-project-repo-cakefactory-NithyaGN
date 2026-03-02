package org.launchcode.cake_factory_back_end.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.transaction.Status;
import org.hibernate.annotations.CreationTimestamp;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Many Cart items belong to One User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-cart")
    private User user;

    // Many Cart items belong to One Cake
    @ManyToOne
    @JoinColumn(name = "cake_id", nullable = false)
    @JsonBackReference("cake-cart")
    private Cake cake;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "selected_size")
    private String selectedSize;

    @Column(name = "selected_flavour")
    private String selectedFlavour;

    @Column(name = "selected_filling")
    private String selectedFilling;

    @Column(name = "message")
    private String message;

    @Column(name = "price", nullable = false)
    private double price;

    //ststus to track cart vs order
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    //Timestamp when item was added or ordered
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    public enum Status {
        IN_CART, CONFIRMED, CANCELLED
    }

    public Cart() {}

    public Cart(User user, Cake cake, int quantity, String selectedSize, String selectedFlavour, String selectedFilling, String message, double price, Cart.Status status) {
        this.user = user;
        this.cake = cake;
        this.quantity = quantity;
        this.selectedSize = selectedSize;
        this.selectedFlavour = selectedFlavour;
        this.selectedFilling = selectedFilling;
        this.message = message;
        this.price = price;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Cake getCake() {
        return cake;
    }

    public void setCake(Cake cake) {
        this.cake = cake;
    }

    public int getQuantity()
    {
        return quantity;
    }
    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }
    public String getSelectedSize()
    {
        return selectedSize;
    }
    public void setSelectedSize(String selectedSize)
    {
        this.selectedSize = selectedSize;
    }
    public String getSelectedFlavour()
    {
        return selectedFlavour;
    }
    public void setSelectedFlavour(String selectedFlavour)
    {
        this.selectedFlavour = selectedFlavour;
    }
    public String getSelectedFilling()
    {
        return selectedFilling;
    }
    public void setSelectedFilling(String selectedFilling)
    {
        this.selectedFilling = selectedFilling;
    }
    public String getMessage()
    {
        return message;
    }
    public void setMessage(String message)
    {
        this.message = message;
    }
    public double getPrice() {

        return price;
    }

    public void setPrice(double price) {

        this.price = price;
    }

    public Cart.Status getStatus() {
        return status;
    }

    public void setStatus(Cart.Status status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", user=" + user +
                ", cake=" + cake +
                ", quantity=" + quantity +
                ", selectedSize='" + selectedSize + '\'' +
                ", selectedFlavour='" + selectedFlavour + '\'' +
                ", selectedFilling='" + selectedFilling + '\'' +
                ", message='" + message + '\'' +
                ", price=" + price +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Cart cart = (Cart) obj;
        return id != null && id.equals(cart.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}