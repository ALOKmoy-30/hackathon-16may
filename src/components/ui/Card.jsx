export function Card({ children, className = '', onClick, hoverable = true }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#141414] border border-[#222222] rounded-xl p-5 transition-all duration-200 ${
        hoverable ? 'hover:bg-[#181818] hover:border-[#2a2a2a]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
