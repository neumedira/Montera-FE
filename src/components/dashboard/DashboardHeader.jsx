export default function DashboardHeader() {
  const today = new Date();

  const hari = today.toLocaleDateString("id-ID", {
    weekday: "long",
  });

  const tanggal = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative mb-5">

      {/* Greeting */}
      <div>
        <h1 className="text-[24px] font-extrabold text-[#292827]">
          Dashboard
        </h1>

        <p className="text-[12px] text-[#99958e] mt-[-2px]">
          Selamat datang, Admin · {hari}, {tanggal}
        </p>
      </div>

    </div>
  );
}