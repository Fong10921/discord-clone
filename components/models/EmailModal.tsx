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
import "react-phone-number-input/style.css";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z
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

const EmailModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "email";
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    setError,
    formState: { errors, isLoading, isSubmitSuccessful },
  } = form;

  const updatePATCHEmail = async (values: z.infer<typeof formSchema>) => {
    let response;
    try {
      response = await axios.patch("/api/settings/myAccount/email", values);
    } catch (error: any) {
      if (error.response.data === "Email already in use") {
        setError("email", {
          type: "manual",
          message: "The email submitted is already in used",
        });
      }
    } finally {
      await signIn("credentials", {
        ...values,
        callbackUrl: window.location.href,
        redirect: false,
      });
      return response?.data;
    }
  };

  const addPOSTEmail = async (values: z.infer<typeof formSchema>) => {
    let response;
    try {
      response = await axios.post("/api/settings/myAccount/email", values);
    } catch (error: any) {
      if (error.response.data === "Email already in use") {
        setError("email", {
          type: "manual",
          message: "The email submitted is already in used",
        });
      }
    } finally {
      return response?.data;
    }
  };

  const updateMutation = useMutation({
    mutationFn: data.user?.email ? updatePATCHEmail : addPOSTEmail,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["currentUser"]}),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.email === data?.user?.email) {
      setError("email", {
        type: "manual",
        message:
          "The email submitted is the same as the one you currently have",
      });
      return;
    }
    updateMutation.mutate(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (isSubmitSuccessful && !errors && !isLoading) {
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
            {data?.user?.email ? "Edit your email" : "Enter a new email"}
          </DialogTitle>
          <DialogDescription className="text-center text-base mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] ">
            {data?.user?.email
              ? "Update your current email address"
              : "Provide a valid email address"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          disabled={isLoading}
                          className="bg-black border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          disabled={isLoading}
                          className="bg-black border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
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
                onClick={handleClose}
                type="button"
                className="bg-transparent hover:underline text-white hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                variant="primary_discord_blue"
                className="text-white"
              >
                {data?.user?.email ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
