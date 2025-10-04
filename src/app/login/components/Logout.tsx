import { LogOut } from "lucide-react";
// import { adLogout } from "../action";

const Logout = () => {
  return (
    <form action={()=>console.log('logout')
      //adLogout
      }>
      <div
        className="my-3 text-center w-full"
        style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
      >
        <button
          type="submit"
          className="flex w-full items-center justify-center cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </button>
      </div>
    </form>
  );
};

export default Logout;
