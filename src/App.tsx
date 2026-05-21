import { Routes, Route } from 'react-router-dom';
import Home from '@/sections/Home';
import StickerswapPrivacy from '@/legal/StickerswapPrivacy';
import StickerswapTerms from '@/legal/StickerswapTerms';
import DeleteAccountPage from '@/legal/DeleteAccountPage';
import NotFound from '@/components/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apps/stickerswap/privacy" element={<StickerswapPrivacy />} />
      <Route path="/apps/stickerswap/terms" element={<StickerswapTerms />} />
      <Route path="/apps/stickerswap/delete-account" element={<DeleteAccountPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
