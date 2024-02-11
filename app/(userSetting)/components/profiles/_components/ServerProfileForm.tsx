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
  DesensitizedUserServerDataBannerColor,
} from "@/constants/types/types";
import EmojiPicker from "@/components/chat/EmojiPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Pen, Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import useFormDataSameAsDatabase from "@/hooks/use-form-data-same-as-database";
import { API_URLS } from "@/constants/apiUrls";
import { StaticImageData } from "next/image";

const serverProfileSchema = z.object({
  serverProfileNickname: z
    .string()
    .max(33, "Please make sure your profile name does not exceed 33 characters")
    .optional(),
  serverProfilePronouns: z.string().optional(),
  serverProfileAboutMe: z
    .string()
    .max(190, "Please make sure your about me is not over 190 characters")
    .optional(),
});

type serverFormValue = {
  serverProfileNickname: string;
  serverProfilePronouns: string;
  serverProfileAboutMe: string;
};

interface ServerProfileFormProps {
  selectedServerData: DesensitizedUserServerDataBannerColor;
  user: User;
  isFetching: boolean;
  setPreviewStateForServer: Dispatch<
    SetStateAction<{
      previewNickname: string;
      previewPronouns: string;
      previewAboutMe: string;
      previewImage: string | StaticImageData;
      previewBannerColor: DesensitizedBannerColor[];
    }>
  >;
}

const ServerProfileForm: React.FC<ServerProfileFormProps> = ({
  selectedServerData,
  isFetching,
  setPreviewStateForServer,
  user,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [remainingAbout, setRemainingAbout] = useState<number>(190);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchControl, setFetchControl] = useState<boolean>(false);

  const rollbackValue = useRef<DesensitizedUserServerDataBannerColor>(selectedServerData);

  const queryClient = useQueryClient();
  const { onOpen: onOpenModal } = useModal();

  const checkForCreatedAtKey = () => {
    const keyExists = selectedServerData.hasOwnProperty("createdAt");
    return keyExists;
  };

  const handleClickOpenBannerColorModal = (
    firstBannerColor?: DesensitizedBannerColor
  ) => {
    if (firstBannerColor) {
      onOpenModal("bannerColor", {
        user: user,
        utils: {
          existingBannerColor: firstBannerColor,
          typeOfBannerColor: "server",
          selectedServerImage: selectedServerData.serverImage,
        },
        key: firstBannerColor.colorValue,
      });
    } else {
      onOpenModal("bannerColor", {
        user: user,
        utils: {
          typeOfBannerColor: "server",
          selectedServerImage: selectedServerData.serverImage,
        },
        key: selectedServerData.serverProfileImage!,
      });
    }
  };

  const form = useForm<serverFormValue>({
    resolver: zodResolver(serverProfileSchema),
    defaultValues: {
      serverProfileNickname: selectedServerData.serverProfileNickname
        ? selectedServerData.serverProfileNickname
        : "",
      serverProfilePronouns: selectedServerData.serverProfilePronouns
        ? selectedServerData.serverProfilePronouns
        : "",
      serverProfileAboutMe: selectedServerData.serverProfileAboutMe
        ? selectedServerData.serverProfileAboutMe
        : "",
    },
  });

  const currentValues = form.getValues() as serverFormValue;
  const formDataSameAsDatabase = useFormDataSameAsDatabase(
    currentValues,
    selectedServerData,
    isFetching
  );

  const {
    formState: { isDirty },
  } = form;

  const createServerProfile = async (values: serverFormValue) => {
    let response;
    const newValue = {
      ...values,
      currentServerImageUseAsId: selectedServerData.serverImage,
    };
    try {
      response = await axios.post(API_URLS.SERVER_PROFILE, newValue);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  const updateServerProfile = async (values: serverFormValue) => {
    let response;
    const newValue = {
      ...values,
      currentServerImageUseAsId: selectedServerData.serverImage,
    };
    try {
      response = await axios.patch(API_URLS.SERVER_PROFILE, newValue);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
  };

  const updateMutation = useMutation({
    mutationFn: checkForCreatedAtKey()
      ? updateServerProfile
      : createServerProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["userServerDataBannerColor"],
      }),
    onMutate: async (variables: serverFormValue) => {
      await queryClient.cancelQueries({queryKey: ["userServerDataBannerColor"]});
      const previousValue = rollbackValue.current;
      rollbackValue.current = selectedServerData,
      queryClient.setQueryData(["userServerDataBannerColor"], rollbackValue.current);
      return {previousValue};
    },
  });
  

  const onSubmit: SubmitHandler<serverFormValue> = (data) => {
    if (formDataSameAsDatabase() === true) {
      form.reset();
      return;
    }

    setIsLoading(true);
    updateMutation.mutate(data);
  };

  const handleInputChange = (name: string, value: string) => {
    setPreviewStateForServer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetPreview = () => {
    handleInputChange(
      "previewNickname",
      selectedServerData.serverProfileNickname!
    );
    handleInputChange(
      "previewPronouns",
      selectedServerData.serverProfilePronouns!
    );
    handleInputChange(
      "previewAboutMe",
      selectedServerData.serverProfileAboutMe!
    );
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
    if (selectedServerData?.serverProfileAboutMe) {
      const aboutMeString = selectedServerData?.serverProfileAboutMe as string;
      const correctLength = countStringLength(aboutMeString);

      setRemainingAbout(190 - correctLength);
    } else {
      setRemainingAbout(190);
    }
  };

  useEffect(() => {
    if (formDataSameAsDatabase() === true && fetchControl === true) {
      form.reset({
        serverProfileNickname: selectedServerData?.serverProfileNickname!,
        serverProfilePronouns: selectedServerData?.serverProfilePronouns || "",
        serverProfileAboutMe: selectedServerData?.serverProfileAboutMe || "",
      });
    }
    resetPreview();
    handleAboutMeCountWhenReset();
    setFetchControl(false);
  }, [selectedServerData, form]);

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
              name="serverProfileNickname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Name"
                      maxLength={33}
                      onChange={(event) => {
                        field.onChange(event);
                        handleInputChange(
                          "previewNickname",
                          event.currentTarget.value
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
              name="serverProfilePronouns"
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
              name="serverProfileAboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="small-text-1232asd text-xs">
                    About Me
                  </FormLabel>
                  <FormControl>
                    <div className="relative p-0 w-[90%] ">
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        rows={4}
                        maxLength={190}
                        placeholder="About Me"
                        onChange={(e) => {
                          const currentValue = field.value;
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
                        if (selectedServerData?.serverProfileAboutMe) {
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
              profileImage: selectedServerData.serverImage,
              typeOfProfilePic: "server",
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
          {selectedServerData.bannerColor
            ? selectedServerData.bannerColor.map((bannerColor, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: bannerColor.colorValue,
                      transform: bannerColor.isActive
                        ? "scale(1.1)"
                        : "scale(1)",
                    }}
                    className={`w-20 h-14 cursor-pointer relative rounded-md box-content z-1 ${
                      index >= 3 ? "mt-5" : ""
                    }`}
                  >
                    <Pen
                      className="cursor-pointer absolute top-0 right-0 mt-1 mr-1"
                      size={13}
                      onClick={() => {
                        if (!isLoading) {
                          handleClickOpenBannerColorModal(bannerColor);
                        }
                      }}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </>
  );
};

export default ServerProfileForm;
