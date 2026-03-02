package org.launchcode.cake_factory_back_end.dto;

public class CartDTO {

    private Long id;
    private Long cakeId;
    private String cakeName;
    private String cakeImage;
    private int quantity;
    private String selectedSize;
    private String selectedFlavour;
    private String selectedFilling;
    private String message;
    private double price;
    private String status;

    public CartDTO() {}

    public CartDTO(Long id, Long cakeId, String cakeName, String cakeImage,
                   int quantity, String selectedSize, String selectedFlavour,
                   String selectedFilling, String message, double price, String status) {
        this.id = id;
        this.cakeId = cakeId;
        this.cakeName = cakeName;
        this.cakeImage = cakeImage;
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
    public void setId(Long id) {
        this.id = id;
    }
    public Long getCakeId() {
        return cakeId;
    }
    public void setCakeId(Long cakeId) {
        this.cakeId = cakeId;
    }
    public String getCakeName() {
        return cakeName;
    }
    public void setCakeName(String cakeName) {
        this.cakeName = cakeName;
    }
    public String getCakeImage() {
        return cakeImage;
    }
    public void setCakeImage(String cakeImage) {
        this.cakeImage = cakeImage;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public String getSelectedSize() {
        return selectedSize;
    }
    public void setSelectedSize(String selectedSize) {
        this.selectedSize = selectedSize;
    }
    public String getSelectedFlavour() {
        return selectedFlavour;
    }
    public void setSelectedFlavour(String selectedFlavour) {
        this.selectedFlavour = selectedFlavour;
    }
    public String getSelectedFilling() {
        return selectedFilling;
    }
    public void setSelectedFilling(String selectedFilling) {
        this.selectedFilling = selectedFilling;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}