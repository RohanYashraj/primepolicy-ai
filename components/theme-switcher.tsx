"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 14;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 rounded-none border border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-colors bg-card/30">
          {theme === "light" ? (
            <Sun key="light" size={ICON_SIZE} className="text-primary" />
          ) : theme === "dark" ? (
            <Moon key="dark" size={ICON_SIZE} className="text-primary" />
          ) : (
            <Laptop key="system" size={ICON_SIZE} className="text-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 rounded-none border-border bg-background/95 backdrop-blur-md p-1" align="end">
        <div className="px-2 py-1.5 text-[8px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-b border-border/50 mb-1">
          Theme // Select
        </div>
        <DropdownMenuRadioGroup value={theme} onValueChange={(e) => setTheme(e)}>
          <DropdownMenuRadioItem 
            className="flex items-center gap-3 rounded-none focus:bg-primary/10 focus:text-primary cursor-pointer px-3 py-2 text-[10px] font-mono uppercase tracking-widest" 
            value="light"
          >
            <Sun size={ICON_SIZE} className="opacity-50" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex items-center gap-3 rounded-none focus:bg-primary/10 focus:text-primary cursor-pointer px-3 py-2 text-[10px] font-mono uppercase tracking-widest" 
            value="dark"
          >
            <Moon size={ICON_SIZE} className="opacity-50" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex items-center gap-3 rounded-none focus:bg-primary/10 focus:text-primary cursor-pointer px-3 py-2 text-[10px] font-mono uppercase tracking-widest" 
            value="system"
          >
            <Laptop size={ICON_SIZE} className="opacity-50" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
