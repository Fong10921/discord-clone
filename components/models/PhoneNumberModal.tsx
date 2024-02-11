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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  phoneNumber: z.string(),
});

const updatePhoneNumber = async (values: z.infer<typeof formSchema>) => {
  const response = await axios.patch(
    "/api/settings/myAccount/phoneNumber",
    values
  );

  if (response.data.error) {
    throw new Error(response.data.error); // Adjust error handling as needed
  }
  return response.data;
};

const PhoneNumberModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "phoneNumber";
  const queryClient = useQueryClient();

  const [country, setCountry] = useState("");

  //Get default country using goggle map api

  /*   useEffect(() => {
      const fetchCountry = async (latitude: number, longitude: number) => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDSQUeYuyWSWbUeUMSRHt95FNi03rYQz3c`);
        console.log(response);
        const countryComponenet = response.data.results[0].address_components.find((component: { types: { include: (arg0: string) => any; }; }) => component.types.include(`country`));
        setCountry(countryComponenet ? countryComponenet.long_name : "");
      };
  
      if (navigator.geolocation) {
        console.log(navigator.geolocation)
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchCountry(latitude, longitude);
        })
      }
    }, []) */

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePhoneNumber,
    onSuccess: () => {
      setIsLoading(true);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const { isSuccess } = updateMutation;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
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
      <DialogContent
        className="bg-[#313338] text-white p-0 overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {data?.user?.phoneNumber
              ? "Edit your phone number"
              : "Enter a new phone number"}
          </DialogTitle>
          <DialogDescription className="text-center text-base mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] ">
            Your phone number will make your account safer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase small-text-1232asd text-xs">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          placeholder="Enter phone number"
                          disabled={isLoading}
                          defaultCountry="MY"
                          international
                          onChange={(value) => field.onChange(value)}
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
                {data?.user?.phoneNumber ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneNumberModal;
