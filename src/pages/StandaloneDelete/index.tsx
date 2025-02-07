import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { HiKey, HiMail } from "react-icons/hi";
import { supabase } from "../../services/supabase";
import { AlertPopup } from "../../components/AlertPopup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StandaloneDelete: React.FC = () => {
  const navigate = useNavigate();
  const onSubmit = (e: any) => {
    e.preventDefault();
    AlertPopup({
      message: "Are you sure you want to delete your account?",
      variant: "danger",
      okText: "Yes",
      onOk: async () => {
        const { email, password } = e.target;
        const { error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });
        if (error) throw error;

        await supabase.functions.invoke("deactivate-user");
        await supabase.auth.signOut();
        toast.success("Account deleted successfully");
        navigate("/");
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg m-auto flex flex-col gap-4">
      <h2 className="text-3xl font-bold mb-8 text-primary">Delete Account</h2>
      <div>
        <div className="mb-2">
          <Label htmlFor="email" value="Email" />
        </div>
        <TextInput
          rightIcon={HiMail}
          id="email"
          placeholder="Your email address"
          required
          type="email"
        />
      </div>
      <div>
        <div className="mb-2">
          <Label htmlFor="password" value="Password" />
        </div>
        <TextInput
          rightIcon={HiKey}
          id="password"
          placeholder="Your password"
          required
          type="password"
          minLength={6}
        />
      </div>
      <Button
        type="submit"
        color="failure"
        onClick={() => {}}
        className="self-end mt-2"
      >
        Delete Account
      </Button>
    </form>
  );
};

export default StandaloneDelete;
