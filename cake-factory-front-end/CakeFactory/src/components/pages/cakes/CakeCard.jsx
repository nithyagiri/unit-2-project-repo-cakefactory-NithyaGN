import Card from'../../common/Card.jsx';
import Spacer from '../../common/Spacer.jsx';
const CakeCard =({cake,onSelect}) =>{
   
    return (
        <Card  clickable={true}>
            <div onClick={()=>onSelect(cake)}>
            <img 
                className="cake-card-image"
                src={'https://i.ibb.co/' + cake.image_id}
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

