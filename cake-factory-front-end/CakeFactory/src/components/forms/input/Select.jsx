import FormField from "./FormField";

const Select = ({ label, value, onChange, options }) => {
  return (
    <FormField label={label}>
      <select
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option 
            key={idx} 
            value={opt.value || opt}
          >
            {opt.label || opt}
          </option>
        ))}
      </select>
    </FormField>
  );
};
export default Select;
