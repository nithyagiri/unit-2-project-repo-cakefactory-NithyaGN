import FormField from "./FormField";

const Input = ({ label, value, onChange, type, placeholder }) => {
  return (
    <FormField label={label}>
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormField>
  );
};
export default Input;
