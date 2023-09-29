"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProfileProps {
  user: User
}

const profileSchema = z.object({
  name: z.string().min(1, "Please make sure your profile name is at least one character long"),
  pronouns: z.string().min(1, "Please make sure your pronouns is not empty"),
});

type profileFormValues = {
  name?: string,
  pronouns?: string,
}

const Profile: React.FC<ProfileProps> = ({
  user
}) => {
  const { openType } = useSettingPageModal();

  const [profile, setProfile] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name!,
      pronouns: "",
    },
  })

  const handleChangeProfile = (profileString: string) => {
    if (profileString === profile) {
      return;
    } else {
      setProfile(profileString);
    }
  }

  const onSubmit: SubmitHandler<profileFormValues> = async (data: profileFormValues) => {
    return;
  }

  if (openType !== "profile") {
    return;
  };

  return (
    <div className="w-full">
      <div className="mb-5 font-bold text-xl w-full">Profile</div>
      <div className="flex flex-row space-x-12">
        <h1 onClick={() => handleChangeProfile("user")} className={cn(`mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`, profile === "user" && "border-[#949CF7]")}>
          User Profile
        </h1>
        <h1 onClick={() => handleChangeProfile("server")} className={cn(`mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`, profile === "server" && "border-[#949CF7]")}>
          Server Profies
        </h1>
      </div>
      {profile === "user" && (
        <div className="flex flex-row">
          <div className="flex flex-col flex-1">
            <h3 className="small-text-1232asd">Display Name</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Name"
                          {...field}
                          className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pronouns" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Add your pronouns"
                          {...field}
                          className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </form>
              <Alert className="absolute p-2 -top-[90%]">
                <div className="flex flex-row justify-between items-center">
                  <AlertTitle>
                    Careful - you have unsaved changes
                  </AlertTitle>
                  <AlertDescription>
                    <div className="flex flex-row space-x-4">
                      <Button>
                        Reset
                      </Button>
                      <Button>
                        Save Changes
                      </Button>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            </Form>
          </div>
          <div className="flex-1">
            <h3 className="small-text-1232asd">Preview</h3>
          </div>
        </div>
      )}
    </div>
  )
};

export default Profile;
