export default function SettingSection({
  title,
  icon,
  iconClass = "bg-[#292725]",
  action,
  children,
}) {
  return (
    <section className="rounded-[18px] bg-[#fffdf8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] md:p-5">

      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-2.5">

          <div
            className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] ${iconClass}`}
          >
            {icon}
          </div>

          <h2 className="text-[11px] font-extrabold tracking-[0.5px] text-[#292725]">
            {title}
          </h2>

        </div>

        {/* RIGHT ACTION */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div>
        {children}
      </div>

    </section>
  );
}