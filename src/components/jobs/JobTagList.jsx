export function JobTagList({ tags = [] }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag} className="tag-chip tag-chip--static">
          #{tag}
        </span>
      ))}
    </div>
  );
}
