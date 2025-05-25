import { AnalyzeDecisionButton } from '@/components/buttons/analyze-decision-button';
import SignOutButton from "@/components/buttons/sign-out-button";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-gray-200">
      <Link href="/">
        <Button variant="ghost">
          <HomeIcon />
        </Button>
      </Link>
      <div className="flex-1 flex justify-center">
        <AnalyzeDecisionButton className="hidden sm:flex" />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SignOutButton />
      </div>
    </header>
  );
};

export default Header;
