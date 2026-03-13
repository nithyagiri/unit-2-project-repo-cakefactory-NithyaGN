export default class CartDTO {
    constructor(userId, cakeId, quantity, selectedSize, selectedFlavour, selectedFilling, message) {
        this.userId = userId;
        this.cakeId = cakeId;
        this.quantity = quantity;
        this.selectedSize = selectedSize;
        this.selectedFlavour = selectedFlavour;
        this.selectedFilling = selectedFilling;
        this.message = message;
    }

    isValid(isCustomizable = true) {
        if (!this.cakeId) return false;
        if (!this.quantity || this.quantity < 1) return false;
        
        // If it's a cupcake, we skip these three checks
        if (isCustomizable) {
            if (!this.selectedSize) return false;
            if (!this.selectedFlavour) return false;
            if (!this.selectedFilling) return false;
        }
        
        return true;
    }
}
