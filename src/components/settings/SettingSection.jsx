export default function SettingsSection({
  icon,
  title,
  iconClass = "",
  children,
  headerRight,
}) {
  return (
    <section className="bg-[#fffdf7] border border-[#e5e0d5] rounded-[15px] overflow-hidden">
      
      {/* Header */}
      <div className="min-h-[50px] px-4 md:px-[14px] py-3 bg-[#faf7ef] border-b border-[#e5e0d5] flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <div
            className={`w-[25px] h-[25px] rounded-[7px] flex items-center justify-center ${iconClass}`}
          >
            {icon}
          </div>

          <h2 className="text-[13px] font-extrabold tracking-wide text-[#292725]">
            {title}
          </h2>
        </div>

        {headerRight}
      </div>

      {/* Content */}
      <div className="p-[14px]">
        {children}
      </div>

    </section>
  );
}