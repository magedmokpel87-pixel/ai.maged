import { useState } from 'react';

// "أعلان لأي شئ قابل للحذف او التعديل" - an ad slot the admin can remove or edit.
export default function AdBanner({ ad, onEdit, onDelete, isAdmin = false }) {
  const [hidden, setHidden] = useState(false);
  if (hidden || !ad) return null;

  return (
    <div className="ad-banner">
      {isAdmin && (
        <div className="ad-controls">
          <button onClick={() => onEdit && onEdit(ad)}>✎</button>
          <button
            onClick={() => {
              setHidden(true);
              onDelete && onDelete(ad.id);
            }}
          >
            ✕
          </button>
        </div>
      )}
      <strong>{ad.title}</strong>
      <p>{ad.description}</p>
    </div>
  );
}
