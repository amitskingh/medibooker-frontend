export default function Loader({ text = "Loading..." }) {
  return (
    <div className="w-full flex items-center justify-center py-10 text-slate-500 text-sm">
      <span className="animate-pulse">{text}</span>
    </div>
  );
}
