export default function VoiceInput({ onSubmit }) {
    return (
      <div className="flex items-center bg-secondary border border-accent rounded p-2">
        <input
          type="text"
          placeholder="Speak or type..."
          className="flex-1 bg-secondary text-light outline-none"
        />
        <button onClick={onSubmit} className="text-accent hover:text-highlight">
          🎤
        </button>
      </div>
    );
  }
  