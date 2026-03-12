export default class UserDTO {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        // no id — backend generates it
    }

    // Validate register form
    isValidForRegister() {
        if (!this.name || this.name.trim() === '') return false;
        if (!this.email || this.email.trim() === '') return false;
        if (!this.password || this.password.trim() === '') return false;
        return true;
    }

    // Validate login form 
    isValidForLogin() {
        if (!this.email || this.email.trim() === '') return false;
        if (!this.password || this.password.trim() === '') return false;
        return true;
    }
}