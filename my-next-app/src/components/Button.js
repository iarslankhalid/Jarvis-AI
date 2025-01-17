export default function Button({ children, onClick }) {
    return (
      <button
        className="bg-highlight text-light py-2 px-4 rounded hover:bg-accent transition"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  