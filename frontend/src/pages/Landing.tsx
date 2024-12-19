import { FaHome } from "react-icons/fa";
import { HiLogin } from "react-icons/hi";
import { MdJoinFull } from "react-icons/md";
import Button from "../components/Button";
import { useGlobalState } from "../redux/slices/global";

function Landing() {
  const { user } = useGlobalState();

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <img src="/images/logo.png" alt="logo" className="w-32 h-32 mb-4" />
      <span className="text-4xl">Astroworld</span>
      <span>A universe with many worlds</span>
      <div className="flex items-center my-4">
        {user ? (
          <Button
            label="Home"
            icon={<FaHome />}
            linkProps={{
              to: "/home/world",
            }}
          />
        ) : (
          <>
            <div className="mr-4">
              <Button
                label="Login"
                icon={<HiLogin />}
                linkProps={{
                  to: "/auth/login",
                }}
              />
            </div>
            <Button
              label="Register"
              icon={<MdJoinFull />}
              linkProps={{
                to: "/auth/register",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Landing;
