const InputField = ({ label, name, type, required, register, error, onBlur, ...rest }) => {
    return (
      <div className="w-full sm:w-1/3 px-3 mb-4">
        <label className="block text-gray-700 font-medium">{label}</label>
        <input
          type={type}
          name={name}
          required={required}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          {...register(name)}
          {...rest}
          onBlur={onBlur}  
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    );
  };
  
  export default InputField;
  