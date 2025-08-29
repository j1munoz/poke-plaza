"use client";

interface FilterMenuProps {
  filterType: "energy" | "condition" | "foil";
  onChange: (value: string) => void;
}

export default function FilterMenu({ filterType, onChange }: FilterMenuProps) {
  return (
    <div className="dropdown flex ml-4 mb-8">
      <button className="dropbtn whitespace-nowrap">Filter By ▼</button>
      <div className="dropdown-content text-white">
        <p className="bg-[#21386E]">
          <b>
            {filterType === "energy"
              ? "Energy Type"
              : filterType === "condition"
                ? "Condition"
                : "Foil Type"}
          </b>
        </p>

        <EnergyTypeRadios onChange={onChange} />
      </div>
    </div>
  );
}

function EnergyTypeRadios({ onChange }: { onChange: (val: string) => void }) {
  const energyTypes = [
    "Grass",
    "Fire",
    "Water",
    "Lightning",
    "Psychic",
    "Fighting",
    "Darkness",
    "Metal",
    "Fairy",
    "Dragon",
    "Colorless",
  ];

  return (
    <div>
      {energyTypes.map((type) => (
        <label key={type} className="flex items-center space-x-2 bg-[#1D2C5E]">
          <input
            type="radio"
            name="typeFilter"
            value={type.toLowerCase()}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="text-white">{type}</span>
        </label>
      ))}
    </div>
  );
}
