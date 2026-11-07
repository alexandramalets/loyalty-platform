export default function Icon({ name, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || null}
    </svg>
  );
}

const icons = {
  home: (
    <>
      <path d="M2.4 7.1 8 2.6l5.6 4.5V13.2H10V9.2H6v4H2.4V7.1Z" />
    </>
  ),
  levels: (
    <>
      <path d="M3 13V8.2M6.5 13V5.2M10 13V9.2M13.5 13V3.4" />
    </>
  ),
  user: (
    <>
      <circle cx="8" cy="5.2" r="2.2" />
      <path d="M3.2 13.1c.7-2.3 2.5-3.4 4.8-3.4s4.1 1.1 4.8 3.4" />
    </>
  ),
  tag: (
    <>
      <path d="M2.6 8.2 7.6 3h5.2v5.2L7.8 13.2 2.6 8.2Z" />
      <circle cx="10.6" cy="5.2" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  bonus: (
    <>
      <circle cx="8" cy="8" r="5.2" />
      <path d="M8 5v6M6.2 6.5h2.5a1.3 1.3 0 0 1 0 2.5H6.4" />
    </>
  ),
  analytics: (
    <>
      <path d="M2.2 12.2 6 8l2.5 2.2L13.6 3.8" />
      <path d="M10.2 3.8h3.4V7" />
    </>
  ),
  settings: (
    <>
      <circle cx="8" cy="8" r="2.1" />
      <path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.5 3.5l1.2 1.2M11.3 11.3l1.2 1.2M12.5 3.5l-1.2 1.2M4.7 11.3l-1.2 1.2" />
    </>
  ),
  help: (
    <>
      <circle cx="8" cy="8" r="5.2" />
      <path d="M6.2 6.4a1.8 1.8 0 0 1 3.3.9c0 1.2-1.5 1.4-1.5 2.5" />
      <circle cx="8" cy="11.6" r="0.55" fill="currentColor" stroke="none" />
    </>
  ),
  search: (
    <>
      <circle cx="7" cy="7" r="3.5" />
      <path d="m9.8 9.8 2.9 2.9" />
    </>
  ),
  bell: (
    <>
      <path d="M4 11.2h8l-.8-1.1V7.3a3.2 3.2 0 0 0-6.4 0v2.8L4 11.2Z" />
      <path d="M6.7 11.5a1.3 1.3 0 0 0 2.6 0" />
    </>
  ),
  chevron: <path d="m4 6 4 4 4-4" />,
  chevronLeft: <path d="m10 4-4 4 4 4" />,
  chevronRight: <path d="m6 4 4 4-4 4" />,
  plus: (
    <>
      <path d="M8 3.2v9.6M3.2 8h9.6" />
    </>
  ),
  close: (
    <>
      <path d="m4 4 8 8M12 4 4 12" />
    </>
  ),
  check: <path d="m3.4 8.2 3 3 6.2-6.4" />,
  alert: (
    <>
      <path d="M8 2.5 14.2 13.3H1.8L8 2.5Z" />
      <path d="M8 6.3v3.3" />
      <circle cx="8" cy="11.2" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="5.2" />
      <path d="M8 7.2v4" />
      <circle cx="8" cy="5.2" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  success: (
    <>
      <circle cx="8" cy="8" r="5.2" />
      <path d="m5.3 8.1 1.8 1.8 3.6-3.8" />
    </>
  ),
  error: (
    <>
      <circle cx="8" cy="8" r="5.2" />
      <path d="M8 5v3.5" />
      <circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  logout: (
    <>
      <path d="M6.4 3.4H3.6v9.2h2.8" />
      <path d="M7 8h5.4M10.2 5.6 12.6 8l-2.4 2.4" />
    </>
  ),
  arrowUp: <path d="M8 12.6V3.4M4.6 6.4 8 3.2l3.4 3.2" />,
  arrowDown: <path d="M8 3.4v9.2M4.6 9.6 8 12.8l3.4-3.2" />,
  calendar: (
    <>
      <rect x="2.4" y="3.2" width="11.2" height="10.2" rx="1.2" />
      <path d="M2.4 6.4h11.2M5.2 2.2v2.2M10.8 2.2v2.2" />
    </>
  ),
  more: (
    <>
      <circle cx="3.4" cy="8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="8" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),
  sort: (
    <>
      <path d="m5 6.2 3-3 3 3M5 9.8l3 3 3-3" />
    </>
  ),
};
