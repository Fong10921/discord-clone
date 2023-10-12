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
import { UsersWithBannerColor } from "@/types";

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
  bannerColor: z.object({
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
  }),
  isActive: z.union([z.string(), z.boolean()]),
});

const BannerColorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = isOpen && type === "bannerColor";
  const queryClient = useQueryClient();

  const userBannerColorData: UsersWithBannerColor | undefined =
    queryClient.getQueryData(["userBannerColor"]);

  const matchingColorObject = userBannerColorData?.bannerColor.find(
    (item) => item.colorValue === data.utils
  );

  const [isActive, setIsActive] = useState<boolean | undefined>(
    matchingColorObject?.isActive
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerColor: userBannerColorData,
      isActive: matchingColorObject?.isActive ? "checked" : "unchecked",
    },
  });

  const updatePATCHBannerColor = async (values: z.infer<typeof formSchema>) => {
    let response;
    const newValue = { ...values, colorId: matchingColorObject?.id };
    try {
      response = await axios.patch(
        "/api/settings/profile/bannerColor",
        newValue
      );
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const addPOSTBannerColor = async (values: z.infer<typeof formSchema>) => {
    let response;
    try {
      response = await axios.post("/api/settings/profile/bannerColor", values);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const DeleteBannerColor = async (values: string) => {
    let response;
    try {
      response = await axios.post("/api/settings/profile/bannerColor", values);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
      handleClose();
      return response?.data;
    }
  };

  const updateMutation = useMutation({
    mutationFn: data?.utils ? updatePATCHBannerColor : addPOSTBannerColor,
    onSuccess: () => queryClient.invalidateQueries(["userBannerColor"]),
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteBannerColor,
    onSuccess: () => queryClient.invalidateQueries(["userBannerColor"]),
  })

  const { isSuccess } = updateMutation;

  const onSubmit = async (values: any) => {
    /* The reason we check for empty object because if empty it means the user havent move the picker thus remind same as the default color if the user have it */
    setIsLoading(true);
    if (
      Object.keys(values?.bannerColor || {}).length === 0 &&
      (values?.isActive === "checked" || values?.isActive === "unchecked")
    ) {
      console.log("We are not doing anything");
      handleClose();
      return;
    }

    updateMutation.mutate(values);
  };

  const onDelete = async (values: string) => {
    setIsLoading(true);
    deleteMutation.mutate(values);
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

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
            {data?.utils ? "Update the Banner Color" : "Choose a Banner Color"}
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
                        color={data.utils}
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
                          {...field}
                          onCheckedChange={() => {
                            field.onChange();
                            setIsActive(!isActive);
                          }}
                          defaultChecked={!matchingColorObject?.isActive}
                          thumbStyle="h-4"
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
                className="bg-transparent hover:underline text-white hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="button"
                onClick={() => onDelete(matchingColorObject?.id!)}
                variant={"destructive"}
                className="bg-transparent hover:underline text-white hover:bg-transparent"
              >
                Delete
              </Button>
              <Button
                disabled={isLoading}
                variant="primary_discord_blue"
                type="submit"
                className="text-white"
              >
                {data?.utils ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerColorModal;
