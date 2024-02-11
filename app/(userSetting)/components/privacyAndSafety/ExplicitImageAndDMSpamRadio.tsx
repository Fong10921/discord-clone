"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DesensitizatizedUserDetails } from "@/constants/types/types";
import { API_URLS } from "@/constants/apiUrls";

interface ExplicitImageAndDMSpamRadioProps {
  type: string;
  data: DesensitizatizedUserDetails;
}

interface PrivacySafetyMutationContext {
  previousValue: string | undefined;
}

const FormSchema = z.object({
  type: z.enum(["ALL", "NON_FRIENDS", "NO_FILTER"]),
});

const ExplicitImageAndDMSpamRadio: React.FC<
  ExplicitImageAndDMSpamRadioProps
> = ({ type, data }) => {
  const [selectedRadioGroup1, setSelectedRadioGroup1] = useState<
    string | undefined
  >(data.explicitImageFilter);
  const [selectedRadioGroup2, setSelectedRadioGroup2] = useState<
    string | undefined
  >(data.dmSpamFilter);
  const rollbackValue = useRef<string | undefined>(
    type === "dMSpam" ? data.dmSpamFilter : data.explicitImageFilter
  );
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const updatePrivacySafetyRadio = async ({
    type,
    value,
  }: {
    type: string | undefined;
    value: string | undefined;
  }) => {
    let response;
    try {
      response = await axios.patch(API_URLS.PRIVACY_SAFETY, { type, value });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const updateMutation = useMutation<
    string | undefined,
    any,
    { type: string | undefined; value: string | undefined },
    PrivacySafetyMutationContext
  >({
    mutationFn: updatePrivacySafetyRadio,
    onMutate: async (variables: { value: string | undefined }) => {
      await queryClient.cancelQueries({ queryKey: ["userPrivacySafety"] });
      const previousValue = rollbackValue.current;
      rollbackValue.current = variables.value;
      queryClient.setQueryData(["userPrivacySafety"], variables.value);
      return { previousValue };
    },
    onError: (
      error: any,
      variables: { type: string | undefined; value: string | undefined },
      context: PrivacySafetyMutationContext | undefined
    ) => {
      queryClient.setQueryData(["userPrivacySafety"], context?.previousValue);
      rollbackValue.current = context?.previousValue;
      type === "dMSpam"
        ? setSelectedRadioGroup2(context?.previousValue)
        : setSelectedRadioGroup1(context?.previousValue);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userPrivacySafety"] });
    },
  });

  function onSubmit(type: string, value: string) {
    updateMutation.mutate({ type, value });
  }

  return (
    <div>
      {type === "explicitImage" && (
        <Form {...form}>
          <form className="space-y-6 mt-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        onSubmit(type, value);
                        setSelectedRadioGroup1(value);
                      }}
                      value={selectedRadioGroup1}
                      className="flex flex-col space-y-1"
                    >
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-green-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup1 === "ALL"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5"
                              value="ALL"
                              id="type"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "ALL"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter all direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "ALL"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              All direct messages will be filtered for explicit
                              images
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-yellow-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup1 === "NON_FRIENDS"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5"
                              value="NON_FRIENDS"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "NON_FRIENDS"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter direct messages from non-friends
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "NON_FRIENDS"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages from non-friends will be filtered
                              for explicit images
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-red-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup1 === "NO_FILTER"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5"
                              value="NO_FILTER"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "NO_FILTER"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Do not filter direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "NO_FILTER"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages will not be filtered for explicit
                              images
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      {type === "dMSpam" && (
        <Form {...form}>
          <form className="space-y-6 mt-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        onSubmit(type, value);
                        setSelectedRadioGroup2(value);
                      }}
                      value={selectedRadioGroup2}
                      className="flex flex-col space-y-1 "
                    >
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-green-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup2 === "ALL"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="ALL" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup2 === "ALL"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter all direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup2 === "ALL"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              All direct messages will be filtered for spam
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-yellow-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup2 === "NON_FRIENDS"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5"
                              value="NON_FRIENDS"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup1 === "NON_FRIENDS"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter direct messages from non-friends
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup2 === "NON_FRIENDS"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages from non-friends will be filtered
                              for spam
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-red-600 rounded-l-md cursor-pointer group hover:bg-[#3c3f44]`,
                          selectedRadioGroup2 === "NO_FILTER"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="w-5 h-5"
                              value="NO_FILTER"
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup2 === "NO_FILTER"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Do not filter direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550] group-hover:text-[#c0c3c9]`,
                                selectedRadioGroup2 === "NO_FILTER"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages will not be filtered for spam
                            </p>
                          </div>
                        </FormItem>
                        <FormMessage />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export default ExplicitImageAndDMSpamRadio;
