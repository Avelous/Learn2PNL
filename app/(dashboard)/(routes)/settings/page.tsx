import { currentUser } from "@/lib/auth";
import { SettingsForm } from "./_components/settings-form";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <SettingsForm user={user} />;
};

export default SettingsPage;
