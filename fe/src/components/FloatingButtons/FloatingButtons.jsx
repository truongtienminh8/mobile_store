import "./FloatingButtons.css";

const FloatingButtons = () => {
  const handleHotline = () => {
    window.location.href = "tel:18002097";
  };

  const handleChat = () => {
    // Mở Zalo chat - thay bằng link Zalo của bạn
    window.open("https://zalo.me/18002097", "_blank");
  };

  return (
    <div className="floating-buttons">
      <button
        className="floating-btn floating-btn-hotline"
        onClick={handleHotline}
        aria-label="Gọi hotline"
        title="Gọi hotline: 1800 2097"
      >
        <svg
          className="floating-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
            fill="currentColor"
          />
        </svg>
        <span className="floating-text">HOTLINE</span>
      </button>

      <button
        className="floating-btn floating-btn-chat"
        onClick={handleChat}
        aria-label="Chat"
        title="Chat với nhân viên tư vấn"
      >
        <svg
          className="floating-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
            fill="currentColor"
          />
          <circle cx="8" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="16" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButtons;
