import React from 'react';

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-semibold text-sm">{initials}</span>
    </div>
  );
}

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 text-sm">
      <span className="text-gray-400 w-16 flex-shrink-0 text-xs uppercase tracking-wide">
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

export function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
