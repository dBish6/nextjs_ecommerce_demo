"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@utils/tw";

const Nav: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4">
      {children}
    </nav>
  );
};
export default Nav;

export const NavLink: React.FC<React.ComponentProps<typeof Link>> = ({
  ...options
}) => {
  const pathname = usePathname();
  return (
    <Link
      {...options}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === options.href && "bg-background text-foreground"
      )}
    />
  );
};
