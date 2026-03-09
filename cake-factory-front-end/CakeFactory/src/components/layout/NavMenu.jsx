import {Link} from "react-router";
const NavMenu =() =>{
    
    return(
        <div className="nav-menu">
        <Link className="link" to ="/">Home</Link>
        <Link className="link" to ="/shop">Shop</Link>
        <Link className="link" to ="/contact">Contact</Link>  
        <Link className="link" to ="/Login">Login</Link>                 
        </div> 
    );
};
export default NavMenu;
