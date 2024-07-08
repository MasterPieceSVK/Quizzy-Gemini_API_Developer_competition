import React from "react";
import type { SVGProps } from "react";

type Icon = {
  size: number;
} & SVGProps<SVGSVGElement>;

export function PlusIcon(props: Icon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 1408 1408"
      {...props}
    >
      <path
        fill="black"
        d="M1408 608v192q0 40-28 68t-68 28H896v416q0 40-28 68t-68 28H608q-40 0-68-28t-28-68V896H96q-40 0-68-28T0 800V608q0-40 28-68t68-28h416V96q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68"
      ></path>
    </svg>
  );
}
