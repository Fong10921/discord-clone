"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ExplicitImageAndDMSpamRadioProps {
  type: string;
}

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

const ExplicitImageAndDMSpamRadio: React.FC<
  ExplicitImageAndDMSpamRadioProps
> = ({ type }) => {
  const [selectedRadioGroup1, setSelectedRadioGroup1] = useState<
    string | undefined
  >();
  const [selectedRadioGroup12, setSelectedRadioGroup2] = useState();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*     toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    }) */
  }

  return (
    <div>
      {type === "explicitImage" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-3"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => setSelectedRadioGroup1(value)}
                      value={selectedRadioGroup1}
                      className="flex flex-col space-y-1"
                    >
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-green-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter all direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              All direct messages will be filtered for explicit
                              images
                            </p>
                          </div>
                        </FormItem>
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-yellow-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all2"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all2" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all2"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter direct messages from non-friends
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all2"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages from non-friends will be filtered
                              for explicit images
                            </p>
                          </div>
                        </FormItem>
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-red-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all3"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all3" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all3"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Do not filter direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all3"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages will not be filtered for explicit
                              images
                            </p>
                          </div>
                        </FormItem>
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-3"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => setSelectedRadioGroup1(value)}
                      value={selectedRadioGroup1}
                      className="flex flex-col space-y-1"
                    >
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-green-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter all direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              All direct messages will be filtered for spam
                            </p>
                          </div>
                        </FormItem>
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-yellow-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all2"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all2" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all2"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Filter direct messages from non-friends
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all2"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages from non-friends will be filtered
                              for spam
                            </p>
                          </div>
                        </FormItem>
                      </div>
                      <div
                        className={cn(
                          `p-3 pl-4 border-l-4 border-red-600 rounded-l-md cursor-pointer`,
                          selectedRadioGroup1 === "all3"
                            ? "bg-[#42444a]"
                            : "bg-[#2b2d31]"
                        )}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem className="w-5 h-5" value="all3" />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel
                              className={cn(
                                `font-semibold text-base`,
                                selectedRadioGroup1 === "all3"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Do not filter direct messages
                            </FormLabel>
                            <p
                              className={cn(
                                `text-sm font-[550]`,
                                selectedRadioGroup1 === "all3"
                                  ? "text-[#dadfe7]"
                                  : "text-[#B5BAC1]"
                              )}
                            >
                              Direct messages will not be filtered for spam
                            </p>
                          </div>
                        </FormItem>
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
