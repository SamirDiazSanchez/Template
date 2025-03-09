"use client";
import { LoadingComponent } from "@components/auth/Loading.component";
import { useAuthentication } from "@hooks/useAuthentication.hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default () => {
  const {
    SignOut
  } = useAuthentication();

  const {
    push
  } = useRouter();

  useEffect(() => {
    SignOut();
    setTimeout(() => push('/login'), 500);
  }, [])

  return (
    <LoadingComponent />
  )
}