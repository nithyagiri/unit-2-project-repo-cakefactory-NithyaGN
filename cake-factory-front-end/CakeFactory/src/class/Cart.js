export default class Cart {
    constructor(
        id,
        userId,
        cakeId,
        cakeName,
        cakeImage,
        quantity,
        selectedSize,
        selectedFlavour,
        selectedFilling,
        message,
        price,
        status
    ) {
        this.id = id;
        this.userId = userId;
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

    isInCart() { return this.status === "IN_CART"; }
    isConfirmed() { return this.status === "CONFIRMED"; }
    isCancelled() { return this.status === "CANCELLED"; }
    getFormattedPrice() { return `$${this.price.toFixed(2)}`; }
    getImageURL() { return "https://i.ibb.co/" + this.cakeImage; }
    getSummary() {
        const parts = [];
        if (this.selectedSize) parts.push(`Size: ${this.selectedSize}`);
        if (this.selectedFlavour) parts.push(`Flavour: ${this.selectedFlavour}`);
        if (this.selectedFilling) parts.push(`Filling: ${this.selectedFilling}`);
        if (this.message) parts.push(`Message: "${this.message}"`);
        return parts.join(" | ") || "No customizations";
    }
}