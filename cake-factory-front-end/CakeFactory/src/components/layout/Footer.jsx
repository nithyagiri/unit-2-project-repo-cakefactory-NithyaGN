import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";// for social media icon
const Footer =() => {
    let thisYear = new Date().getFullYear();
    return(
        <footer>
            <div>&copy; {thisYear}  Cake Factory|All rights reserved 
            </div>
            <div className ="socialMediaIcons">
                <a 
                href="https://www.facebook.com/profile.php?id=61583264956563" 
                target="_blank" 
                rel="noopener noreferrer">
                <FaFacebook size={40} color="#3b5998" /> 
                </a>   
                <a
                href="https://www.instagram.com/mailtocakefactory/"
                target="_blank"
                rel="noopener noreferrer">
                <FaInstagram size={40} color="#E4405F" />
                </a>
            </div>
        </footer>
    )
}
export default Footer;
                    