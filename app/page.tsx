import { redirect } from "next/navigation";

export default function Home() {
  redirect("/personal-info/base-info");
}
