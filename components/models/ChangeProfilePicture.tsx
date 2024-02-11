"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FileUpload from "../FileUpload";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_URLS } from "@/constants/apiUrls";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Profile Image is required",
  }),
});

const ChangeProfilePicture = () => {
  const { isOpen, onClose, type, data } = useModal();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>();
  let apiRoute: string;
  let invalidateQueries: string;

  if (data?.utils) {
    apiRoute =
      data?.utils.typeOfProfilePic === "server"
        ? API_URLS.SERVER_PROFILE_PICTURE
        : API_URLS.USER_PROFILE_PICTURE;
    invalidateQueries =
      data?.utils.typeOfProfilePic === "server"
        ? "userServerDataBannerColor"
        : "userBannerColor";
  }

  const isModalOpen = isOpen && type === "changeProfilePicture";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  const updatePATCHProfilePicture = async (
    values: z.infer<typeof formSchema>
  ) => {
    let response;
    let updatedValue = { ...values, ServerImage: data?.utils.profileImage };
    try {
      response = await axios.patch(apiRoute, updatedValue);
    } catch (error: any) {
    } finally {
      handleClose();
      return response?.data;
    }
  };

  const deleteProfilePicture = async (values: z.infer<typeof formSchema>) => {
    let response;
    try {
      response = await axios.delete(apiRoute, { data: { values } });
    } catch (error: any) {
      console.log(error);
    } finally {
      handleClose();
      return response?.data;
    }
  };

  const updateMutation = useMutation({
    mutationFn: updatePATCHProfilePicture,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [invalidateQueries] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [invalidateQueries] }),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (values === data?.utils.profileImage) {
      handleClose();
      return;
    }
    updateMutation.mutate(values);
  };

  const onDelete = async (values: z.infer<typeof formSchema>) => {
    if (data?.utils.profileImage === "") {
      handleClose();
      return;
    }

    setIsLoading(true);
    deleteMutation.mutate(values);
  };

  const handleClose = () => {
    form.reset();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Change your Profile Picture
          </DialogTitle>
          <DialogDescription className="text-center text-white">
            Customize your presence and make your profile unique and
            identifiable with a new profile picture. This visual cue is an
            important aspect of how you're perceived in the digital space.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <div className="bg-[#E6E6E6]/90">
                            <FileUpload
                              endpoint="profileImage"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className="bg-[#313338] px-6 py-4">
              <Button
                disabled={isLoading}
                type="button"
                onClick={handleClose}
                variant={"secondary"}
                className=" hover:underline text-white"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="button"
                onClick={() => onDelete(data?.utils.profileImage)}
                variant={"destructive"}
                className="hover:underline text-white hover:opacity-90"
              >
                Delete
              </Button>
              <Button
                disabled={isLoading}
                variant="primary"
                type="submit"
                className="hover:underline text-white hover:opacity-90"
              >
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfilePicture;
