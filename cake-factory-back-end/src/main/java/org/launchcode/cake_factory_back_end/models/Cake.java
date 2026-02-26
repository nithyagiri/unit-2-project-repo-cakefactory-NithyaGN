package org.launchcode.cake_factory_back_end.models;
import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "cakes")
public class Cake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Boolean customization;

    @Enumerated(EnumType.STRING)
    private Category category;

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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isCustomization() {
        return customization;
    }

    public void setCustomization(boolean customization) {
        this.customization = customization;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImagePath() {
        return image_id;
    }

    public void setImagePath(String imagePath) {
        this.image_id = imagePath;
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

    public boolean isCanWriteMessage() {
        return canWriteMessage;
    }

    public void setCanWriteMessage(boolean canWriteMessage) {
        this.canWriteMessage = canWriteMessage;
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
        if (o == null || getClass() != o.getClass()) return false;
        Cake cake = (Cake) o;
        return Objects.equals(id, cake.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
