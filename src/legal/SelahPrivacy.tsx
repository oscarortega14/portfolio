import LegalLayout from './LegalLayout';
import { selahPrivacyContent, SELAH_LAST_UPDATED, SELAH_NAME } from './selahContent';

export default function SelahPrivacy() {
  return <LegalLayout content={selahPrivacyContent} lastUpdated={SELAH_LAST_UPDATED} appName={SELAH_NAME} />;
}
