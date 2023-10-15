"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pen, Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import useBannerColor from "@/hooks/use-bannercolor";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "@/hooks/use-current-user";
import { UsersWithBannerColor } from "@/types";
import { BannerColor } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "@/components/chat/EmojiPicker";

interface ProfileProps {
  data: UsersWithBannerColor | null;
}

const profileSchema = z.object({
  name: z
    .string()
    .min(
      1,
      "Please make sure your profile name is at least one character long"
    ),
  pronouns: z.string().min(1, "Please make sure your pronouns is not empty"),
  aboutMe: z
    .string()
    .max(190, "Please make sure your about me is not over 190 characters"),
});

type profileFormValues = {
  name?: string;
  pronouns?: string;
  aboutMe?: string;
};

const Profile: React.FC<ProfileProps> = ({ data }) => {
  const { openType } = useSettingPageModal();
  const { onOpen: onOpenModal } = useModal();

  const [profile, setProfile] = useState("user");
  const [isVisible, setIsVisible] = useState(false);
  const [remainingAbout, setRemainingAbout] = useState<number>(190);
  const [emojiAbout, setEmojiAbout] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: userBannerColorData } = useQuery(
    ["userBannerColor"],
    useBannerColor,
    {
      initialData: data,
    }
  );

  const { data: userData } = useQuery(["currentUser"], useCurrentUser, {
    initialData: data,
  });

  const handleClickOpenBannerColorModal = (firstBannerColor?: string) => {
    if (firstBannerColor && typeof firstBannerColor === "string") {
      onOpenModal("bannerColor", {
        user: userData,
        utils: firstBannerColor,
      });
    } else {
      onOpenModal("bannerColor", {
        user: userData,
      });
    }
  };

  function countStringLength(str: string): number {
    return Array.from(str).length;
  }

  const handleRemainingAbout = (currentValue: string, newValue: string) => {
    const oldLength = countStringLength(currentValue);
    const newLength = countStringLength(newValue);

    const difference = newLength - oldLength;
    setRemainingAbout((prevRemaining) => prevRemaining - difference);
  };

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      pronouns: userData.pronouns ? userData.pronouns : "",
      aboutMe: userData.aboutMe ? userData.aboutMe : "",
    },
  });

  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (isDirty) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isDirty]);

  const handleChangeProfile = (profileString: string) => {
    if (profileString === profile) {
      return;
    } else {
      setProfile(profileString);
    }
  };

  const onSubmit: SubmitHandler<profileFormValues> = async (
    data: profileFormValues
  ) => {
    console.log("Submitting");
    return;
  };

  if (openType !== "profile") {
    return;
  }

  return (
    <div className="w-full">
      <div className="mb-5 font-bold text-xl w-full">Profile</div>
      <div className="flex flex-row space-x-12 flex-1">
        <h1
          onClick={() => handleChangeProfile("user")}
          className={cn(
            `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
            profile === "user" && "border-[#949CF7]"
          )}
        >
          User Profile
        </h1>
        <h1
          onClick={() => handleChangeProfile("server")}
          className={cn(
            `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
            profile === "server" && "border-[#949CF7]"
          )}
        >
          Server Profies
        </h1>
      </div>
      {profile === "user" && (
        <div className="flex flex-row">
          <div className="flex flex-col flex-1 w-[90%]">
            <h3 className="small-text-1232asd text-xs">Display Name</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="my-4">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Name"
                            {...field}
                            className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Separator className="space-y-12 my-12 bg-[#4E5058] w-[90%]" />
                  <FormField
                    control={form.control}
                    name="pronouns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="small-text-1232asd text-xs">
                          Pronouns
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Add your pronouns"
                            {...field}
                            className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Separator className="space-y-12 my-12 bg-[#4E5058] w-[90%]" />
                  <FormField
                    control={form.control}
                    name="aboutMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="small-text-1232asd text-xs">
                          About Me
                        </FormLabel>
                        <FormControl>
                          <div className="relative p-1 w-[90%] ">
                            <Textarea
                              disabled={isLoading}
                              {...field}
                              rows={4}
                              onChange={(e) => {
                                const currentValue = field.value!;
                                const newValue = e.target.value;

                                handleRemainingAbout(currentValue, newValue);

                                field.onChange(e);
                              }}
                              className="w-full pr-10 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px]"
                              style={{ boxSizing: "border-box" }}
                            />

                            <span className="absolute right-3 top-3">
                              <EmojiPicker
                                onChange={(emoji) => {
                                  if (emoji) {
                                    setRemainingAbout(remainingAbout - countStringLength(emoji));
                                  }
                                  field.onChange(`${field.value}${emoji}`);
                                }}
                              />
                            </span>
                            <span className="absolute right-3 bottom-5">
                              {remainingAbout}
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Alert
                    className={cn(
                      `absolute p-3 bottom-[-200%] transition-all duration-500`,
                      isVisible ? `alert-visible` : "hidden"
                    )}
                  >
                    <div className="flex flex-row justify-between items-center">
                      <AlertTitle className="pl-2 m-0">
                        Careful - you have unsaved changes!
                      </AlertTitle>
                      <AlertDescription>
                        <div className="flex flex-row space-x-4">
                          <Button
                            className="h-8 bg-transparent hover:underline text-white hover:bg-transparent"
                            onClick={() => form.reset()}
                          >
                            Reset
                          </Button>
                          <Button
                            type="submit"
                            className="h-8 text-white bg-[#248046] hover:bg-[#1A6334] rounded-sm"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                </div>
              </form>
            </Form>
            <Separator className="my-7 bg-[#4E5058] w-[90%]" />
            <h3 className="small-text-1232asd text-xs">Avatar</h3>
            <Button
              className="mt-5 mr-3 text-sm py-0 tracking-wide px-4 text-white font-[590] w-[90%] h-8 rounded-none"
              variant="primary_discord_blue"
            >
              Change Avatar
            </Button>
            <div className="space-y-6">
              <Separator className="my-7 bg-[#4E5058] w-[90%]" />
              <div className="flex justify-between w-[90%] mt-4">
                <h3 className="small-text-1232asd text-xs">Banner Color</h3>
                <Plus
                  onClick={() => handleClickOpenBannerColorModal()}
                  className="hover:cursor-pointer hover:opacity-80"
                  size={16}
                />
              </div>
              <div className="grid grid-cols-3 w-[90%]">
                {userBannerColorData.bannerColor.map(
                  (bannerColor: BannerColor, index: number) => {
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: bannerColor.colorValue,
                          transform: bannerColor.isActive
                            ? "scale(1.1)"
                            : "scale(1)",
                        }}
                        className={cn(
                          `w-20 h-14 cursor-pointer relative rounded-md box-content`,
                          { "mt-5": index >= 3 }
                        )}
                      >
                        <Pen
                          className="cursor-pointer absolute top-0 right-0 mt-1 mr-1"
                          size={13}
                          onClick={() =>
                            handleClickOpenBannerColorModal(
                              bannerColor.colorValue
                            )
                          }
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="small-text-1232asd">Preview</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
