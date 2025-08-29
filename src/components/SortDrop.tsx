"use client";

import RadioGroup from "./RadioGroup";

interface SortMenuProps {
  priceFilter: "high-to-low" | "low-to-high" | "none";
  dateFilter: "newest" | "oldest" | "none";
  onChange: (name: "priceFilter" | "dateFilter", value: string) => void;
}

export default function SortMenu({
  priceFilter,
  dateFilter,
  onChange,
}: SortMenuProps) {
  return (
    <div className="dropdown flex ml-4 mb-8">
      <button className="dropbtn whitespace-nowrap">Sort By ▼</button>
      <div className="dropdown-content text-white">
        <RadioGroup
          name="priceFilter"
          title="Price"
          options={[
            { label: "High to Low", value: "high-to-low" },
            { label: "Low to High", value: "low-to-high" },
          ]}
          selectedValue={priceFilter}
          onChange={(value) => onChange("priceFilter", value)}
        />

        <RadioGroup
          name="dateFilter"
          title="Date"
          options={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
          ]}
          selectedValue={dateFilter}
          onChange={(value) => onChange("dateFilter", value)}
        />
      </div>
    </div>
  );
}
