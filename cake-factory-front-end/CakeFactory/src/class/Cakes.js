export default class Cakes {
    constructor(
        id,
        name,
        description,
        price,
        customization,
        category,
        image_id,
        sizes,
        flavors,
        fillings,
        canWriteMessage
    ) {
        this.id = id;
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

    // Get formatted price
    getFormattedPrice() {
        return `$${this.price.toFixed(2)}`;
    }

    // Check if cake is customizable
    isCustomizable() {
        return this.customization === true;
    }

    // Get parsed sizes array
    getParsedSizes() {
        try {
            return typeof this.sizes === 'string'
                ? JSON.parse(this.sizes)
                : this.sizes || [];
        } catch {
            return [];
        }
    }

    // Get parsed flavors array
    getParsedFlavors() {
        try {
            return typeof this.flavors === 'string'
                ? JSON.parse(this.flavors)
                : this.flavors || [];
        } catch {
            return [];
        }
    }

    // Get parsed fillings array
    getParsedFillings() {
        try {
            return typeof this.fillings === 'string'
                ? JSON.parse(this.fillings)
                : this.fillings || [];
        } catch {
            return [];
        }
    }
}
