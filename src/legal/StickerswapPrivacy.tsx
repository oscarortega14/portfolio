import LegalLayout from './LegalLayout';
import { privacyContent, LAST_UPDATED } from './legalContent';

export default function StickerswapPrivacy() {
  return <LegalLayout content={privacyContent} lastUpdated={LAST_UPDATED} />;
}
