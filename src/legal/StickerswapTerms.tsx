import LegalLayout from './LegalLayout';
import { termsContent, LAST_UPDATED } from './legalContent';

export default function StickerswapTerms() {
  return <LegalLayout content={termsContent} lastUpdated={LAST_UPDATED} />;
}
