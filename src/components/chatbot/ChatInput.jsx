export default function ChatInput({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-t bg-white">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg focus:outline-blue-500 text-sm"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
}
