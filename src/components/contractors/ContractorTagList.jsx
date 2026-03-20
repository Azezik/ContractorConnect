export function ContractorTagList({ items = [] }) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span key={item} className="tag-chip tag-chip--static">{item}</span>
      ))}
    </div>
  );
}
