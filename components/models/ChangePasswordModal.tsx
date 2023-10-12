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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import bcrypt from "bcrypt";

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (password) => /[a.z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /\d/.test(password),
      "Password must contain at least one digit"
    )
    .refine(
      (password) => /\W/.test(password),
      "Password must contain at least one special characters"
    ),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (password) => /[a.z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /\d/.test(password),
      "Password must contain at least one digit"
    )
    .refine(
      (password) => /\W/.test(password),
      "Password must contain at least one special characters"
    ),
  confirmNewPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (password) => /[a.z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /\d/.test(password),
      "Password must contain at least one digit"
    )
    .refine(
      (password) => /\W/.test(password),
      "Password must contain at least one special characters"
    ),
});

type FormInputs = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePasswordModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = isOpen && type === "changePassword";

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const updatePATCHPassword = async (values: z.infer<typeof formSchema>) => {
    let response;
    try {
      response = await axios.patch(
        "/api/settings/myAccount/changePassword",
        values
      );
    } catch (error: any) {
    } finally {
      handleClose();
      return response?.data;
    }
  };

  const updateMutation = useMutation({
    mutationFn: updatePATCHPassword,
  });

  const { isSuccess } = updateMutation;
  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isCorrectPassword = await bcrypt.compare(
      values.currentPassword,
      data.utils
    );

    if (!isCorrectPassword) {
      setError("currentPassword", {
        type: "manual",
        message:
          "The current password you entered is wrong please check again.",
      });
    }

    if (values.newPassword !== values.confirmNewPassword) {
      setError("newPassword", {
        type: "manual",
        message: "Please make sure the new password you entered match",
      });
      setError("confirmNewPassword", {
        type: "manual",
        message: "Please make sure the new password you entered match",
      });
    };

    if (values.currentPassword === values.newPassword || values.currentPassword === values.confirmNewPassword) {
      handleClose();
      return;
    }

    setIsLoading(true);
    updateMutation.mutate(values);
  };

  const handleClose = () => {
    setIsLoading(false);
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
            Update your password
          </DialogTitle>
          <DialogDescription className="text-center text-base mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] ">
            Enter your current password and a new password
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          disabled={isLoading}
                          type="password"
                          className="mt-2"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          disabled={isLoading}
                          type="password"
                          className="mt-2"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          disabled={isLoading}
                          type="password"
                          className="mt-2"
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
                variant="primary_discord_blue"
                type="submit"
                className="text-white"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
