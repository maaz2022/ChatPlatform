"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { useConversation } from "@/hooks/useConversation";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import Link from "next/link";

const MobileNav = () => {
  const paths = useNavigation();
  const { isActive } = useConversation();

  // If isActive is true (meaning there's an active conversation), return null to hide MobileNav
  if (isActive) return null;

  return (
    <Card className="fixed bottom-12 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button size="icon" variant={path.active ? "default" : "outline"}>
                      {path.icon}
                    </Button>
                    {path.count ? <Badge className="absolute left-6 bottom-7 px-2">{path.count}</Badge> : null}
                  </TooltipTrigger>
                  <TooltipContent>{path.name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
         
         <li>
            <ThemeToggle />
         </li>         
          <li>
            <UserButton />
          </li>     
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
