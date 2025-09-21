'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImageViewer } from '@/components/profile/image-viewer';
import { User, Edit, Eye, Upload } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState("https://picsum.photos/seed/1/200");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form fields
  const [name, setName] = useState("Alex Doe");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("1990-01-01");
  const [address, setAddress] = useState("123 Main St, Anytown, USA");
  const [gender, setGender] = useState("male");
  const [bio, setBio] = useState(
    "Senior Legal Analyst at Acme Inc. Passionate about leveraging AI to streamline contract analysis and mitigate risks."
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
      // In a real app, you would upload the file to Firebase Storage here and save the URL.
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture has been set. Click 'Save Changes' to persist it.",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend/Firebase here.
    const userProfileData = {
      name,
      phone,
      dob,
      address,
      gender,
      bio,
      avatarUrl,
    };
    console.log("Saving data:", userProfileData);
    toast({
      title: "Changes Saved!",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarUrl} data-ai-hint="user avatar" />
                        <AvatarFallback>
                          <User className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setIsViewerOpen(true)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View picture</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleUploadClick}>
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload picture</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-muted-foreground">alex.doe@example.com</p>
                </div>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.doe@example.com" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <ImageViewer
        src={avatarUrl}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}
