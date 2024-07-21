"use client";
import { Error } from "@/components/RegisterForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [requestError, setRequestError] = useState<string>("");

  const router = useRouter();
  useQuery({
    queryKey: ["logout"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/auth/logout`, {
          withCredentials: true,
        })
        .then(() => {
          router.push("/");
        })
        .catch((e: Error) => {
          console.log(e);
          if (e.response?.data) {
            setRequestError(e.response.data.error);
          } else if (e.code === "ERR_NETWORK") {
            setRequestError("Network error. The server may be down.");
          } else if (e.message) {
            setRequestError(e.message);
          }
        }),
  });
  if (requestError) {
    return (
      <div>
        <p className="text-center text-red-500">{requestError}</p>
      </div>
    );
  }
}
