export default class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        // no password — never sent to frontend for security
    }

    
    getDisplayName() {
        return this.name;
    }
    
      getEmail() {
        return this.email;
    }
   
}