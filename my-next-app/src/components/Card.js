export default function Card({ title, description }) {
    return (
      <div className="p-4 bg-secondary border border-accent rounded">
        <h2 className="text-highlight text-lg font-semibold">{title}</h2>
        <p className="text-light">{description}</p>
      </div>
    );
  }
  