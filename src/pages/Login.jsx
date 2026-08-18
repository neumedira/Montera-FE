import { useState } from "react";
import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ChefHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#242321] flex items-center justify-center">

      <div className="w-[482px] flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-5">

          {/* Orange shadow */}
          <div className="absolute top-[8px] left-[8px] w-[88px] h-[88px] rounded-[20px] bg-[#FFA45B]" />

          {/* Logo */}
          <div className="relative w-[88px] h-[88px] rounded-[24px] bg-[#FFFDF5] flex items-center justify-center">
            <ChefHat
              size={28}
              strokeWidth={2.5}
              className="text-[#302F2C]"
            />
          </div>

        </div>

        {/* Brand */}
        <h1 className="font-serif text-[30px] font-bold tracking-tight text-[#FFFDF5] leading-none">
          Montera
        </h1>

        <p className="mt-2 text-[10px] tracking-[3px] text-[#777572]">
          ADMIN DASHBOARD
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="w-full mt-[50px]"
        >

          {/* Username */}
          <div className="h-[54px] rounded-[15px] border-2 border-[#575551] bg-[#2B2A28] flex items-center px-5 transition focus-within:border-[#77736E]">

            <UserRound
              size={18}
              strokeWidth={2}
              className="text-[#8B8983] shrink-0"
            />

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username / Email"
              className="w-full ml-4 bg-transparent outline-none text-[16px] text-[#FFFDF5] placeholder:text-[#777572]"
            />

          </div>

          {/* Password */}
          <div className="h-[54px] mt-4 rounded-[15px] border-2 border-[#575551] bg-[#2B2A28] flex items-center px-5 transition focus-within:border-[#77736E]">

            <LockKeyhole
              size={18}
              strokeWidth={2}
              className="text-[#8B8983] shrink-0"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full ml-4 bg-transparent outline-none text-[16px] text-[#FFFDF5] placeholder:text-[#777572]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8B8983] hover:text-[#FFFDF5] transition"
            >
              {showPassword ? (
                <EyeOff size={21} />
              ) : (
                <Eye size={21} />
              )}
            </button>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-[70px] mt-5 rounded-[15px] bg-[#FFFDF5] text-[#292825] text-[20px] font-extrabold hover:bg-[#F5F1E8] transition"
          >
            Masuk
          </button>

        </form>

        {/* Footer */}
        <p className="mt-10 text-[15px] text-[#55534F]">
          Hanya untuk admin Montera Cafe
        </p>

      </div>

    </div>
  );
}