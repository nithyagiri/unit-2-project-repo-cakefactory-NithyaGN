package org.launchcode.cake_factory_back_end.models;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    //Many Orders belong to One User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //MAny Orders belong to one Cake
    @ManyToOne
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    public enum Status {
        CONFIRMED, CANCELLED
    }

    public Order() {}

    // Getters and Setters
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
    public double getPrice()
    {
        return price;
    }
    public void setPrice(double price)
    {
        this.price = price;
    }
    public Status getStatus()
    {
        return status;
    }
    public void setStatus(Status status)
    {
        this.status = status;
    }
}