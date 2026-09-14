import Link from "next/link";

interface CTAButtonProps {
  href: string;
  text: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  external?: boolean;
}

export default function CTAButton({ href, text, variant = "primary", size = "md", external = false }: CTAButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-electric-500 text-white hover:bg-electric-600 shadow-lg hover:shadow-xl",
    secondary: "bg-navy-800 text-white hover:bg-navy-700",
    outline: "border-2 border-electric-500 text-electric-500 hover:bg-electric-500 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={classes}>
        {text}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {text}
    </Link>
  );
}
