package org.launchcode.cake_factory_back_end.models;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cakeId;
    private Long userId;
    private int quantity;
    private String selectedSize;
    private String selectedFlavour;
    private String selectedFilling;
    private String message;

    public Cart() {}

    public Long getId()
    {
        return id;
    }
    public Long getCakeId()
    {
        return cakeId;
    }
    public void setCakeId(Long cakeId)
    {
        this.cakeId = cakeId;
    }
    public Long getUserId()
    {
        return userId;
    }
    public void setUserId(Long userId)
    {
        this.userId = userId;
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
}