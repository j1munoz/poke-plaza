import RadioGroup from "./RadioGroup";

export default function SortMenu() {
  return (
    <>
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
          />

          <RadioGroup
            name="dateFilter"
            title="Date"
            options={[
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
