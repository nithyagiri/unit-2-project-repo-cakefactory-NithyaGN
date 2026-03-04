import Card from'../../common/Card.jsx';
import Spacer from '../../common/Spacer.jsx';
const CakeCard =({cake,onSelect}) =>{
    const getImageURL = () => {
        return 'https://i.ibb.co/' + cake.imageId;
    }
    return (
        <Card  clickable={true}>
            <div onClick={()=>onSelect(cake)}>
            <img 
                className="cake-card-image"
                src={getImageURL()}
                alt={`Image of ${cake.name} `} // accessability
            />
            </div>
            <div className="cake-card-text" >
                <h5>{cake.name}</h5>
            </div>
            <Spacer marginY="10px"/>
        </Card>
    );
};
export default CakeCard;