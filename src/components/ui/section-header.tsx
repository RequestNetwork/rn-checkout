interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="w-full">
      <h2 className="text-[#9297A1] uppercase text-sm font-medium tracking-wide mb-4">
        {title}
      </h2>
      <div className="h-px bg-[#D1D7E3] w-full" />
    </div>
  );
}
