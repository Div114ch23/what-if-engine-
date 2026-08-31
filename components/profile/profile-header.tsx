import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Crown } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProfileHeaderProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-2xl">
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
              <Badge
                variant={user.role === "PREMIUM" || user.role === "ADMIN" ? "default" : "secondary"}
              >
                {user.role === "PREMIUM" && <Crown className="mr-1 h-3 w-3" />}
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
