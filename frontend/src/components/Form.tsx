"use client";
import React, { useState } from "react";

import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

type FormProps = {
  registerView: boolean;
};

export default function Form(props: FormProps) {
  const [registerView, setRegisterView] = useState(props.registerView);

  return (
    <div className="bg-base-100 flex flex-col justify-center items-center h-lvh">
      <h1 className="mb-4 text-2xl font-bold ">Create an account or sign in</h1>
      <div className="card   shrink-0 shadow-2xl flex justify-center items-center border-4 border-primary/70">
        <div className="flex justify-around w-full">
          <button
            onClick={() => {
              setRegisterView(true);
            }}
            className={`btn btn-primary w-1/2 rounded-tl-xl rounded-r-none rounded-bl-none ${
              registerView && "bg-primary/70 border-0 border-primary/70 "
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setRegisterView(false)}
            className={`btn btn-primary w-1/2 rounded-tr-xl rounded-l-none  rounded-br-none ${
              !registerView && "bg-primary/70 border-0 border-primary/70 "
            }`}
          >
            Sign In
          </button>
        </div>
        {registerView ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
