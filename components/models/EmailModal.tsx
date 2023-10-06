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

const formSchema = z.object({
  email: z.string().email("Must be a valid email address"),
});

const EmailModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "email";
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { setError } = form;

  const updatePATCHPhoneNumber = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.patch("/api/settings/myAccount/email", values);
    console.log(response)
    console.log(response.data.error);
    if (response.data.error === "Email already in use") {
      setError("email", {
        type: "manual",
        message: "The email submitted is already in used",
      });
    }
    return response.data;
  };

  const addPOSTPhoneNumber = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.post("/api/settings/myAccount/email", values);
    console.log(response)
    console.log(response.data.error);
    if (response.data.error === "Email already in use") {
      setError("email", {
        type: "manual",
        message: "The email submitted is already in used",
      });
    }

    return response.data;
  };

  const updateMutation = useMutation({
    mutationFn: data.user?.email ? updatePATCHPhoneNumber : addPOSTPhoneNumber,
    onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
  });

  const { isLoading, isSuccess } = updateMutation;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.email === data?.user?.email) {
      setError("email", {
        type: "manual",
        message: "The email submitted is the same as the one you currently have",
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
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] text-white p-0 overflow-hidden">
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
                          {...field}
                          onChange={(value) => field.onChange(value)}
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
