const Card =({children,clickable}) =>{
    return <div className={`card ${clickable && 'clickable-card'}`}> {children}</div>
};
export default Card;