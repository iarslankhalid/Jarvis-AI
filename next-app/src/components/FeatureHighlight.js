export default function FeatureHighlight({ title, description, icon }) {
  return (
    <div className="p-6 bg-black border-2 border-neonPink rounded-lg shadow-neon hover:shadow-neonBlue transform transition-all duration-300 hover:scale-105 max-w-full">
      {/* Icon */}
      <div className="flex items-center justify-center mb-4 text-5xl text-neonBlue glowing-text">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-neonPink text-2xl font-bold mb-3 text-center glowing-text">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-center text-sm">{description}</p>
    </div>
  );
}
