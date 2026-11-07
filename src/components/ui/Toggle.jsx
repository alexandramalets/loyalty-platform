export default function Toggle({ label, ...props }) {
  return (
    <label className="toggle">
      <input type="checkbox" role="switch" aria-label={label} {...props} />
      <span className="toggle__track" />
    </label>
  );
}
