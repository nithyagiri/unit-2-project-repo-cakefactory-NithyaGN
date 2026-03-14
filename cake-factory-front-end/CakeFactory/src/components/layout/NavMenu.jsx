import {Link, useNavigate} from "react-router";
import { useData } from "../../context/DataContext";

const NavMenu =() =>{
    const navigate = useNavigate();
    const { currentUser,setCurrentUser } = useData();
    const handleLogout = () => {
        setCurrentUser(null); 
        navigate('/'); 
    };
    return(
        <div className="nav-bar">
            <div className="nav-menu">
            <Link className="link" to ="/">Home</Link>
            <Link className="link" to ="/shop">Shop</Link>
            <Link className="link" to ="/contact">Contact</Link> 
            {currentUser ? (
                    <Link className="link" to ="/"onClick={handleLogout}>Logout</Link>
                ) : (
                    <Link className="link" to="/Login">Login</Link>
                )}
        </div>

        <div className ="nav-user">
                {currentUser && (              
                    <Link className="link cart-icon" to="/checkout">
                        Hi, {currentUser.name} 🛒
                    </Link>
                )}
         </div>    
        </div>
    );
};
export default NavMenu;
