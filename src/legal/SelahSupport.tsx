import LegalLayout from './LegalLayout';
import { selahSupportContent, SELAH_LAST_UPDATED, SELAH_NAME } from './selahContent';

export default function SelahSupport() {
  return <LegalLayout content={selahSupportContent} lastUpdated={SELAH_LAST_UPDATED} appName={SELAH_NAME} />;
}
