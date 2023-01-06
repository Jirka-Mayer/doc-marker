export function Field({ fieldName, title, onActivate }) {
  return (
    <div>
      <label>[{fieldName}] {title}:</label>
      <input type="text" onFocus={() => {onActivate(fieldName)}} />
    </div>
  )
}