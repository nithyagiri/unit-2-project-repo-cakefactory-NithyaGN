package org.launchcode.cake_factory_back_end.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "cakes")
public class Cake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( name ="name", nullable = false)
    private String name;

    @Lob
    @Column( name ="description", columnDefinition = "TEXT")
    private String description;

    @Column(name ="price", nullable = false)
    private Double price;

    @Column(name = "customization")
    private Boolean customization;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

    @Column(name = "image_id")
    private String image_id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String sizes;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String flavors;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String fillings;

    private Boolean canWriteMessage;

    public enum Category {
        BIRTHDAY, WEDDING, ANNIVERSARY, CUPCAKE, OTHER
    }
    @OneToMany(mappedBy = "cake", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cart> cartItems = new ArrayList<>();

    @OneToMany(mappedBy = "cake", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    public Cake() {}

    public Cake(String name, String description, double price, boolean customization, Category category, String imagePath, String sizes, String flavors, String fillings, boolean canWriteMessage) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.customization = customization;
        this.category = category;
        this.image_id = image_id;
        this.sizes = sizes;
        this.flavors = flavors;
        this.fillings = fillings;
        this.canWriteMessage = canWriteMessage;
    }
    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean getCustomization() {
        return customization;
    }

    public void setCustomization(Boolean customization) {
        this.customization = customization;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImage_id() {
        return image_id;
    }

    public void setImage_id(String image_id) {
        this.image_id = image_id;
    }

    public String getSizes() {
        return sizes;
    }

    public void setSizes(String sizes) {
        this.sizes = sizes;
    }

    public String getFlavors() {
        return flavors;
    }

    public void setFlavors(String flavors) {
        this.flavors = flavors;
    }

    public String getFillings() {
        return fillings;
    }

    public void setFillings(String fillings) {
        this.fillings = fillings;
    }

    public Boolean getCanWriteMessage() {
        return canWriteMessage;
    }

    public void setCanWriteMessage(Boolean canWriteMessage) {
        this.canWriteMessage = canWriteMessage;
    }

    public List<Cart> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<Cart> cartItems) {
        this.cartItems = cartItems;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    @Override
    public String toString() {
        return "cake{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", customization=" + customization +
                ", category=" + category +
                ", image_id='" + image_id + '\'' +
                ", sizes='" + sizes + '\'' +
                ", flavors='" + flavors + '\'' +
                ", fillings='" + fillings + '\'' +
                ", canWriteMessage=" + canWriteMessage +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cake cake = (Cake) o;
        return Objects.equals(id, cake.id);
    }


    @Override
    public int hashCode()
    {
        return Objects.hash(id);
    }
}
