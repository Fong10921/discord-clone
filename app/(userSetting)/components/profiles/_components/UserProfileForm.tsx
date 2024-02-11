"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DesensitizedBannerColor,
  UsersWithBannerColor,
} from "@/constants/types/types";
import EmojiPicker from "@/components/chat/EmojiPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { BannerColor } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Pen } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import useFormDataSameAsDatabase from "@/hooks/use-form-data-same-as-database";
import { API_URLS } from "@/constants/apiUrls";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Please make sure your profile name is at least 1 character long")
    .max(
      33,
      "Please make sure your profile name does not exceed 33 characters"
    ),
  pronouns: z.string().optional(),
  aboutMe: z
    .string()
    .max(190, "Please make sure your about me is not over 190 characters")
    .optional(),
});

type profileFormValues = {
  name?: string;
  pronouns?: string;
  aboutMe?: string;
};

interface UserProfileFormProps {
  userProfile: UsersWithBannerColor;
  isFetching: boolean;
  setPreviewState: Dispatch<
    SetStateAction<{
      previewName: string | null;
      previewPronouns: string | null;
      previewAboutMe: string | null;
    }>
  >;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userProfile,
  isFetching,
  setPreviewState,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [remainingAbout, setRemainingAbout] = useState<number>(190);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { onOpen: onOpenModal } = useModal();
  const [fetchControl, setFetchControl] = useState<boolean>(false);

  const handleClickOpenBannerColorModal = (
    firstBannerColor?: DesensitizedBannerColor
  ) => {
    if (firstBannerColor) {
      onOpenModal("bannerColor", {
        user: userProfile,
        utils: {
          existingBannerColor: firstBannerColor,
          typeOfBannerColor: "user",
        },
      });
    } else {
      onOpenModal("bannerColor", {
        user: userProfile,
        utils: {
          typeOfBannerColor: "user",
        },
      });
    }
  };

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile.name!,
      pronouns: userProfile.pronouns ? userProfile.pronouns : "",
      aboutMe: userProfile.aboutMe ? userProfile.aboutMe : "",
    },
  });

  const currentValues = form.getValues() as profileFormValues;
  const formDataSameAsDatabase = useFormDataSameAsDatabase(
    currentValues,
    userProfile,
    isFetching
  );

  const {
    formState: { isDirty },
  } = form;

  const updatePatchProfile = async (values: profileFormValues) => {
    let response;
    try {
      response = await axios.patch(API_URLS.USER_PROFILE, values);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  const updateMutation = useMutation({
    mutationFn: updatePatchProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userBannerColor"]}),
  });

  const onSubmit: SubmitHandler<profileFormValues> = (data) => {
    if (formDataSameAsDatabase()) {
      form.reset();
      return;
    }

    setIsLoading(true);
    updateMutation.mutate(data);
  };

  const handleInputChange = (name: string, value: string) => {
    setPreviewState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetPreview = () => {
    handleInputChange("previewName", userProfile.name!);
    handleInputChange("previewPronouns", userProfile.pronouns!);
    handleInputChange("previewAboutMe", userProfile.aboutMe!);
  };

  const reset = () => {
    setIsLoading(false);
    setFetchControl(true);
    setIsVisible(false);
  };

  const handleRemainingAbout = (currentValue: string, newValue: string) => {
    const oldLength = countStringLength(currentValue);
    const newLength = countStringLength(newValue);

    const difference = newLength - oldLength;
    setRemainingAbout((prevRemaining) => prevRemaining - difference);
  };

  function countStringLength(str: string): number {
    return Array.from(str).length;
  }

  const handleAboutMeCountWhenReset = () => {
    if (userProfile?.aboutMe) {
      const aboutMeString = userProfile.aboutMe as string;
      const correctLength = countStringLength(aboutMeString);

      setRemainingAbout(190 - correctLength);
    } else {
      setRemainingAbout(190);
    }
  };

  useEffect(() => {
    if (formDataSameAsDatabase() === true && fetchControl === true) {
      form.reset({
        name: userProfile.name!,
        pronouns: userProfile.pronouns || "",
        aboutMe: userProfile.aboutMe || "",
      });
    }
    resetPreview();
    handleAboutMeCountWhenReset();
    setFetchControl(false);
  }, [userProfile, form]);

  useEffect(() => {
    if (isDirty) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isDirty]);

  return (
    <>
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
                      {...field}
                      disabled={isLoading}
                      placeholder="Name"
                      maxLength={33}
                      onChange={(value) => {
                        field.onChange(value);
                        handleInputChange(
                          "previewName",
                          value.currentTarget.value!
                        );
                      }}
                      className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
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
                      {...field}
                      disabled={isLoading}
                      placeholder="Add your pronouns"
                      maxLength={33}
                      onChange={(value) => {
                        field.onChange(value);
                        handleInputChange(
                          "previewPronouns",
                          value.currentTarget.value
                        );
                      }}
                      className="rounded-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px] w-[90%]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
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
                    <div className="relative p-0 w-[90%] ">
                      <Textarea
                        {...field}
                        placeholder="About Me"
                        disabled={isLoading}
                        rows={4}
                        maxLength={190}
                        onChange={(e) => {
                          const currentValue = field.value!;
                          const newValue = e.target.value;
                          handleInputChange(
                            "previewAboutMe",
                            e.currentTarget.value
                          );
                          handleRemainingAbout(currentValue, newValue);

                          field.onChange(e);
                        }}
                        className="w-full pr-10 pl-1focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-[0px]"
                        style={{ boxSizing: "border-box" }}
                      />

                      <span className="absolute right-3 top-3">
                        <EmojiPicker
                          onChange={(emoji: string) => {
                            if (emoji) {
                              setRemainingAbout(
                                remainingAbout - countStringLength(emoji)
                              );
                            }
                            field.onChange(`${field.value}${emoji}`);
                            handleInputChange(
                              "previewAboutMe",
                              `${field.value}${emoji}`
                            );
                          }}
                        />
                      </span>
                      <span className="absolute right-3 bottom-5">
                        {remainingAbout}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Alert
              className={cn("absolute p-3 transition-all duration-500 z-10", {
                "alert-visible": isVisible,
                "alert-hidden": !isVisible,
              })}
            >
              <div className="flex flex-row justify-between items-center">
                <AlertTitle className="pl-2 m-0">
                  Careful - you have unsaved changes!
                </AlertTitle>
                <AlertDescription>
                  <div className="flex flex-row space-x-4">
                    <Button
                      type="button"
                      disabled={isLoading}
                      className="h-8 bg-transparent hover:underline text-white hover:bg-transparent"
                      onClick={() => {
                        form.reset();
                        if (userProfile?.aboutMe) {
                          //Spread it so emoji unicode code count correctly
                          handleAboutMeCountWhenReset();
                        } else {
                          setRemainingAbout(190);
                        }
                        resetPreview();
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
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
        disabled={isLoading}
        onClick={() =>
          onOpenModal("changeProfilePicture", {
            utils: {
              profileImage: userProfile.image,
              typeOfProfilePic: "user",
            },
          })
        }
      >
        Change Avatar
      </Button>
      <div className="space-y-6">
        <Separator className="my-7 bg-[#4E5058] w-[90%]" />
        <div className="flex justify-between w-[90%] mt-4">
          <h3 className="small-text-1232asd text-xs">Banner Color</h3>
          <Plus
            onClick={() => {
              if (isLoading === false) {
                handleClickOpenBannerColorModal();
              } else {
                return;
              }
            }}
            className="hover:cursor-pointer hover:opacity-80"
            size={16}
          />
        </div>
        <div className="grid grid-cols-3 w-[90%]">
          {userProfile.bannerColor.map(
            (bannerColor: BannerColor, index: number) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: bannerColor.colorValue,
                    transform: bannerColor.isActive ? "scale(1.1)" : "scale(1)",
                  }}
                  className={cn(
                    `w-20 h-14 cursor-pointer relative rounded-md box-content z-1`,
                    { "mt-5": index >= 3 }
                  )}
                >
                  <Pen
                    className="cursor-pointer absolute top-0 right-0 mt-1 mr-1"
                    size={13}
                    onClick={() => {
                      if (isLoading === false) {
                        handleClickOpenBannerColorModal(bannerColor);
                      } else {
                        return;
                      }
                    }}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileForm;
