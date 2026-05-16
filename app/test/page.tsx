export default function TestPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0A0A0B" }}>
      <svg width="200" height="200" viewBox="0 0 36 36" style={{ background: "#333" }}>
        <circle cx="18" cy="18" r="16" fill="#FFB020" />
        <path d="M 2 18 A 16 16 0 0 0 34 18 Z" fill="#0a0e27" />
      </svg>
    </div>
  );
}
