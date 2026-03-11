const FormField = ({ label, children }) => {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="form-input">{children}</div>
    </div>
  );
};
export default FormField;

 