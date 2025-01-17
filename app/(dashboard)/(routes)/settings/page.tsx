import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";

import { SettingsForm } from "./_components/settings-form";

const SettingsPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <SettingsForm user={user} />;
};

export default SettingsPage;
