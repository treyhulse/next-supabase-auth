"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (!user) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/login">
          <User2 className="h-5 w-5" />
          <span className="sr-only">Sign in</span>
        </Link>
      </Button>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={user.user_metadata?.avatar_url || ""} />
      <AvatarFallback className="bg-sky-500">
        {user.email?.[0].toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
} 