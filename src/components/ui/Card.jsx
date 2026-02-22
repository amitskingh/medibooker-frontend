export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}
