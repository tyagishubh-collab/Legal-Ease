import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Update your personal information and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://picsum.photos/seed/1/200" data-ai-hint="user avatar" />
                    <AvatarFallback>
                        <User className="h-10 w-10" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Alex Doe</h2>
                    <p className="text-muted-foreground">alex.doe@example.com</p>
                </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Alex Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex.doe@example.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Senior Legal Analyst at Acme Inc. Passionate about leveraging AI to streamline contract analysis and mitigate risks."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end pt-4">
                  <Button>Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
