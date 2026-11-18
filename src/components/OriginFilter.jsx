export default function OriginFilter({ origins, selected, onToggle }) {
  return (
    <fieldset className="filter">
      <legend className="sr-only">Filter by origin</legend>
      {origins.map((origin) => (
        <label key={origin}>
          <input
            type="checkbox"
            checked={selected.includes(origin)}
            onChange={() => onToggle(origin)}
          />
          {origin}
        </label>
      ))}
    </fieldset>
  );
}