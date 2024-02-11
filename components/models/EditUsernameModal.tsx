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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .refine((data) => /^[a-zA-Z0-9_.]+$/.test(data), {
      message:
        "Username can only contain numbers, letters, underscores, or periods.",
    }),
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

const EditUsernameModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "editUsername";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        "/api/settings/myAccount/editUsername",
        {
          ...values,
          type: "PATCH: updateUsername",
        }
      );

      if (response.data.error) {
        console.log(response);
        return;
      }

      toast.success("Username updated");
      form.reset();
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error("An error occurred while updating the server."); // Notify user about the error
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-[#313338] text=white p-0 overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Change your username
          </DialogTitle>
          <DialogDescription className="text-center text-base mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] ">
            Enter a new username and your existing password
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          {...field}
                          disabled={isLoading}
                          placeholder=""
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
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder=""
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUsernameModal;
