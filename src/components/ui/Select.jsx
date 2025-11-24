export default function Select({ options = [], className = "", ...props }) {
  console.log("OPTIONS: ", options);

  return (
    <select
      className={`w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {options.map((opt) => {
        const label =
          typeof opt.label === "object"
            ? JSON.stringify(opt.label)
            : String(opt.label ?? "");
        const value = opt.value ?? opt;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
