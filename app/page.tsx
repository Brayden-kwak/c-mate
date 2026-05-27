import { redirect } from "next/navigation";

const Home = () => {
  redirect("/personal-info/base-info");
};

export default Home;
