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
  const classes = `${base} ${variants[variant]} ${className}`;
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
