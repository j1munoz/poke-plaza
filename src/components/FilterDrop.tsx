interface FilterMenuProps {
  filterType: "energy" | "condition" | "foil"; // Define the accepted filter types
}

export default function FilterMenu({ filterType }: FilterMenuProps) {
  return (
    <div className="dropdown flex ml-4 mb-8">
      <button className="dropbtn whitespace-nowrap">Filter By ▼</button>
      <div className="dropdown-content text-white">
        <p className="bg-[#21386E]">
          {" "}
          <b>
            {filterType === "energy"
              ? "Energy Type"
              : filterType === "condition"
                ? "Condition"
                : "Foil Type"}{" "}
          </b>
        </p>

        {filterType === "energy" ? (
          <EnergyTypeRadios />
        ) : filterType === "condition" ? (
          <ConditionRadios />
        ) : (
          "Foil Type"
        )}
      </div>
    </div>
  );
}

function ConditionRadios() {
  const conditions = [
    "Mint",
    "Lightly Played",
    "Moderately Played",
    "Heavily Played",
    "Damaged",
  ];

  return (
    <div>
      {conditions.map((condition) => (
        <label
          key={condition}
          className="flex items-center space-x-2 bg-[#1D2C5E]"
        >
          <input
            type="radio"
            name="conditionFilter"
            value={condition.toLowerCase().replace(" ", "-")}
            className="form-radio text-blue-600"
          />
          <span className="text-white">{condition}</span>
        </label>
      ))}
    </div>
  );
}

function EnergyTypeRadios() {
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
            className="form-radio text-blue-600"
          />
          <span className="text-white">{type}</span>
        </label>
      ))}
    </div>
  );
}
