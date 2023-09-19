"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import AuthSocialButton from "@/components/AuthSocialButton";
import { useRouter } from "next/navigation";



const registerSchema = z.object({
  name: z.string().min(1, "Please make sure the name is at least 1 characters"),
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

const loginSchema = z.object({
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

type Variant = "LOGIN" | "REGISTER";

type AuthFormValues = {
  name?: string; 
  email: string;
  password: string;
};

const AuthForm = () => {
  let formSchema = null;
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<Variant>("LOGIN");

  const title = variant === "LOGIN" ? "Login" : "Sign Up";
  const router = useRouter();

  {variant === "REGISTER" ? formSchema = registerSchema : formSchema = loginSchema};

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(variant === "REGISTER" ? registerSchema : loginSchema),
    defaultValues: variant === "REGISTER"
      ? {
          name: "",
          email: "",
          password: "",
        }
      : {
          email: "",
          password: "",
        },
  });
  

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const onSubmit: SubmitHandler<AuthFormValues> = async (
    data: AuthFormValues
  ) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/auth/register", data)
        .then(() => {
          signIn("credentials", data);
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Login Failed");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Login Sucessfull");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
        });
    }

  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error(`Sign in to ${action} failed. Please try again`);
        }

        if (callback?.ok && !callback?.error) {
          toast.success(`Sign in to ${action} success.`);
        }
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
        router.refresh();
      });
  };

  return (
    <>
      <div className="m-5">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="w-full text-white"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col mx-auto my-9 space-y-8 w-[85%]">
            {variant === "REGISTER" ? (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg">Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Name"
                        {...field}
                        className="text-black focus:ring-offset-blue-700 focus-visible:ring-0 focus-visible:ring-offset-[5px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg">Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Email"
                      {...field}
                      className="text-black focus:ring-offset-blue-700 focus-visible:ring-0 focus-visible:ring-offset-[5px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Password"
                      {...field}
                      className="text-black focus:ring-offset-blue-700 focus-visible:ring-0 focus-visible:ring-offset-[5px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-700/80 hover:text-white"
            >
              {variant === "LOGIN" ? "Login" : "Sign Up"}
            </Button>
            <div className="mt-6 flex gap-2">
              {/* GitHub Button */}
              <AuthSocialButton
                disabled={isLoading}
                className=" transition text-white"
                size={18}
                icon={BsGithub}
                onClick={() => socialAction("github")}
              />

              {/* Google Button */}
              <AuthSocialButton
                disabled={isLoading}
                className="bg-red-600 transition text-white"
                size={18}
                icon={BsGoogle}
                onClick={() => socialAction("google")}
              />
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-white">
              <div>
                {variant === "LOGIN"
                  ? "New to Discord ?"
                  : "Already have an account ?"}
              </div>
              <div onClick={toggleVariant} className="underline cursor-pointer">
                {variant === "LOGIN" ? "Create an account" : "Login"}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
