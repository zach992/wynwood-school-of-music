import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base = "inline-block rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors";
  const variants = {
    primary: "bg-wsm-accent text-white hover:bg-wsm-accent-hover",
    outline: "border-2 border-wsm-accent text-wsm-accent hover:bg-wsm-accent hover:text-white",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
