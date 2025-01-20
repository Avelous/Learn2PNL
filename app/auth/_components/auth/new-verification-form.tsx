"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/actions/auth/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { CardWrapper } from "./card-wrapper";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!isLoading) return;

    if (!token) {
      setError("Missing token");
      setIsLoading(false);
      return;
    }

    try {
      const data = await newVerification(token);
      setSuccess(data?.success);
      setError(data?.error);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/signin"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center w-full">
        {isLoading && <BeatLoader color="#2563EB" />}
        {!isLoading && error && <FormError message={error} />}
        {!isLoading && success && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  );
};
