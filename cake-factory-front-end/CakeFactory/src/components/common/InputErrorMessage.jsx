const InputErrorMessage = ({hasError,msg}) =>{
    return <>{hasError && <p className="error-message">{msg}</p>}</>
};

export default InputErrorMessage;