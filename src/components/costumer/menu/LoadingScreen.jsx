import loadingLogo from "../../../assets/costumer/Loading Monteraa.png";

export default function LoadingScreen() {
  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center">
      {/* Overlay transparan + sedikit gelap */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      <img
        src={loadingLogo}
        alt="Montera"
        className="relative z-10 w-[150px] animate-loading-logo object-contain"
      />
    </main>
  );
}