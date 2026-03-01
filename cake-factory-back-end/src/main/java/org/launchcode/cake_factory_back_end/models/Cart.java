package org.launchcode.cake_factory_back_end.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Many Cart items belong to One User
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many Cart items belong to One Cake
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cake_id", nullable = false)
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
    public Cart() {}

    public Long getId()
    {
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

}