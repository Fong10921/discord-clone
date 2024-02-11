"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Controller,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sketch } from "@uiw/react-color";
import { Switch } from "../ui/switch";
import { API_URLS } from "@/constants/apiUrls";
import { DesensitizedBannerColor } from "@/constants/types/types";

const colorSchema = z.object({
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
});

const hslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

const hsvSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  v: z.number().min(0).max(100),
});

const alphaSchema = z.number().min(0).max(1);

const formSchema = z.object({
  bannerColor: z
    .object({
      rgb: colorSchema.optional(),
      hsl: hslSchema.optional(),
      hsv: hsvSchema.optional(),
      rgba: colorSchema.extend({ a: alphaSchema }).optional(),
      hsla: hslSchema.extend({ a: alphaSchema }).optional(),
      hsva: hsvSchema.extend({ a: alphaSchema }).optional(),
      hex: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      hexa: z
        .string()
        .regex(/^#[0-9a-fA-F]{8}$/)
        .optional(),
    })
    .optional(),
  isActive: z.union([z.string(), z.boolean()]).optional(),
});

const BannerColorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [currentBannerColorData, setCurrentBannerColorData] =
    useState<DesensitizedBannerColor | null>();
  const [weirdBanner, setWeirdBanner] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isModalOpen = isOpen && type === "bannerColor";
  const queryClient = useQueryClient();
  let apiRoute: string;
  let invalidateQueries: string;

  if (data?.utils) {
    apiRoute =
      data?.utils.typeOfBannerColor === "server"
        ? API_URLS.SERVER_PROFILE_BANNER_COLOR
        : API_URLS.USER_PROFILE_BANNER_COLOR;

    invalidateQueries =
      data?.utils.typeOfBannerColor === "server"
        ? "userServerDataBannerColor"
        : "userBannerColor";
  }

  useEffect(() => {
    if (data?.utils?.existingBannerColor) {
      setCurrentBannerColorData(data.utils.existingBannerColor);
    } else {
      setCurrentBannerColorData(null);
    }
  }, [data?.utils?.existingBannerColor, isOpen, onClose]);

  const [isActive, setIsActive] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerColor: currentBannerColorData?.colorValue,
      isActive: currentBannerColorData?.isActive ? "checked" : "unchecked",
    },
  });

  const updatePATCHBannerColor = async (values: z.infer<typeof formSchema>) => {
    let response;
    let newValue;
    if (weirdBanner === values.bannerColor?.hex) {
      newValue = {
        ...values,
        oldColorValue: currentBannerColorData?.colorValue,
        choosenServerImage: data.utils.selectedServerImage,
        bannerColor: undefined,
      };
    } else {
      newValue = {
        ...values,
        oldColorValue: currentBannerColorData?.colorValue,
        choosenServerImage: data.utils.selectedServerImage,
      };
    }

    try {
      response = await axios.patch(apiRoute, newValue);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const addPOSTBannerColor = async (values: z.infer<typeof formSchema>) => {
    let response;
    setWeirdBanner(values?.bannerColor?.hex!);
    const newValue = {
      ...values,
      choosenServerImage: data.utils.selectedServerImage,
    };
    try {
      response = await axios.post(apiRoute, newValue);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const deleteBannerColor = async () => {
    let response;
    try {
      response = await axios.delete(apiRoute, {
        data: {
          oldColorValue: currentBannerColorData?.colorValue,
          choosenServerImage: data.utils.selectedServerImage,
        },
      });
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const updateMutation = useMutation({
    mutationFn: data?.utils?.existingBannerColor
      ? updatePATCHBannerColor
      : addPOSTBannerColor,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [invalidateQueries] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBannerColor,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [invalidateQueries] }),
  });

  const { isSuccess } = updateMutation;

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    if (
      Object.keys(values?.bannerColor || {}).length === 0 &&
      (values?.isActive === "checked" || values?.isActive === "unchecked")
    ) {
      handleClose();
      return;
    }

    updateMutation.mutate(values);
  };

  const onDelete = async () => {
    setIsLoading(true);
    deleteMutation.mutate();
  };

  const handleClose = () => {
    // Reset the form to initial values
    form.reset({
      bannerColor: undefined,
      isActive: "unchecked",
    });

    // Reset local states to their initial values
    setCurrentBannerColorData(null);
    setIsActive(false);
    setIsLoading(false);

    // Close the modal
    onClose();
  };

  useEffect(() => {
    setIsActive(currentBannerColorData?.isActive!);
  }, [currentBannerColorData]);

  useEffect(() => {
    if (!isLoading || isSuccess) {
      handleClose();
    }
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-[#313338] text-white p-0 overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {data?.utils?.existingBannerColor
              ? "Update the Banner Color"
              : "Choose a Banner Color"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <Controller
                name="bannerColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase small-text-1232asd text-xs">
                      Color Picker
                    </FormLabel>
                    <FormControl>
                      {/* The onChange props will only be filled if we move it color is used to set the bannerColor */}
                      <Sketch
                        {...field}
                        width={475}
                        onChange={(newShade) => field.onChange(newShade)}
                        color={currentBannerColorData?.colorValue}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col space-y-4">
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Active {isActive ? "(on)" : "(off)"}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-blue-500 h-6 w-11 mt-24"
                          checked={isActive} // Controlled component
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            setIsActive(!isActive);
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <DialogFooter className="px-6 py-4 flex">
              <Button
                disabled={isLoading}
                type="button"
                onClick={handleClose}
                variant={"secondary"}
                className=" hover:underline text-white"
              >
                Cancel
              </Button>
              {data?.utils?.existingBannerColor && (
                <Button
                  disabled={isLoading}
                  type="button"
                  onClick={() => onDelete()}
                  variant={"destructive"}
                  className="hover:underline text-white hover:opacity-90"
                >
                  Delete
                </Button>
              )}
              <Button
                disabled={isLoading}
                type="submit"
                variant="primary"
                className="hover:underline text-white hover:opacity-90"
              >
                {data?.utils?.existingBannerColor ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerColorModal;
