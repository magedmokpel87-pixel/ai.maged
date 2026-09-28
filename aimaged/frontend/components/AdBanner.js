import { absUrl } from '../lib/api';

export default function AdBanner({ ad, lang = 'ar' }) {
  if (!ad) return null;
  const title = lang === 'en' ? ad.titleEn : ad.titleAr;
  const body = lang === 'en' ? ad.bodyEn : ad.bodyAr;
  const inner = (
    <div className="ad-banner">
      {ad.imageUrl && <img className="ad-img" src={absUrl(ad.imageUrl)} alt={title} />}
      <div className="ad-text">
        <strong>{title}</strong>
        {body && <p>{body}</p>}
      </div>
    </div>
  );
  return ad.linkUrl ? <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a> : inner;
}
