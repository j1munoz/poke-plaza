interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupItems {
  name: string;
  title: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (value: string) => void; 
}

export default function RadioGroup({ name, title, options, selectedValue, onChange }: RadioGroupItems) {
  return (
    <>
      <p className="bg-[#21386E] text-white px-4 py-2 font-semibold">{title}</p>
      {options.map(({ label, value }) => (
        <label
          key={value}
          className="flex items-center space-x-2 bg-[#1D2C5E] text-white px-4 py-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={value}
            checked={selectedValue === value}
            onChange={(e) => onChange?.(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span>{label}</span>
        </label>
      ))}
    </>
  );
}
