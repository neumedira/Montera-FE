export default function SummaryCard({
  title,
  value,
  subtitle = "HARI INI",
  icon: Icon,
  variant = "default",
}) {
  const variants = {
    dark: {
      background: "bg-[#292827]",
      text: "text-white",
      secondary: "text-[#898681]",
      icon: "text-[#aaa7a1]",
    },

    red: {
      background: "bg-[#ed3445]",
      text: "text-white",
      secondary: "text-[#f28b96]",
      icon: "text-[#ffc1c7]",
    },

    orange: {
      background: "bg-[#f8a35e]",
      text: "text-[#292827]",
      secondary: "text-[#8d684d]",
      icon: "text-[#72543e]",
    },

    light: {
      background: "bg-[#fffdf5]",
      text: "text-[#292827]",
      secondary: "text-[#aaa7a1]",
      icon: "text-[#85827c]",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`
        ${style.background}
        ${style.text}
        min-h-[105px]
        rounded-2xl
        px-4
        py-4
        relative
        overflow-hidden
      `}
    >
      {/* Title */}
      <div className="text-[10px] font-medium tracking-wide uppercase">
        {title}
      </div>

      {/* Icon */}
      {Icon && (
        <Icon
          size={20}
          strokeWidth={1.8}
          className={`
            absolute
            right-4
            top-4
            ${style.icon}
          `}
        />
      )}

      {/* Value */}
      <div className="mt-5 text-[20px] font-extrabold">
        {value}
      </div>

      {/* Subtitle */}
      <div
        className={`
          text-[9px]
          mt-[-1px]
          uppercase
          ${style.secondary}
        `}
      >
        {subtitle}
      </div>
    </div>
  );
}