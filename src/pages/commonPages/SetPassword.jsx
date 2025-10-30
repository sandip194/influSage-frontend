import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const SideImageSlider = React.lazy(() =>
  import("../../components/common/SideImageSlider")
);

export const SetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUserInfo({
      email: params.get("email"),
      firstName: params.get("firstName"),
      lastName: params.get("lastName"),
      roleId: params.get("roleId"),
    });
  }, [location.search]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const { email, firstName, lastName, roleId } = userInfo;
      const payload = {
        email,
        firstName,
        lastName,
        roleId: Number(roleId),
        password: data.password,
      };

      const response = await axios.post("/auth/set-password", payload);

      if (response.status === 201) {
        const { token, user } = response.data;
        // Save token and user
        localStorage.setItem("auth_token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("roleId", user.role);
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("email", user.email);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch(
          setCredentials({
            token,
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          })
        );

        toast.success("Password set successfully!");
        if (user.role === 1) navigate("/complate-profile");
        else if (user.role === 2) navigate("/complate-vendor-profile");
        else navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-5 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* 🔹 Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<div>Loading...</div>}>
          <SideImageSlider />
        </Suspense>
      </div>

      {/* 🔹 Glass Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div>
            <img
              src="/influSage-logo.png"
              alt="Logo"
              className="h-8 w-auto mb-2"
            />
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Set Your Password
              </h2>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      message:
                        "Must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char",
                    },
                  })}
                  className="w-full mt-1 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "Please accept terms & conditions",
                })}
                className="mt-1 h-4 w-4"
              />
              <p>
                I agree to{" "}
                <span
                  className="text-indigo-600 cursor-pointer font-medium"
                  onClick={() => setShowModal(true)}
                >
                  Terms & Conditions
                </span>
              </p>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500">{errors.terms.message}</p>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#0e1532] text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔹 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl mt-10 overflow-y-auto max-h-[85vh]">
            <h3 className="text-xl font-semibold mb-3">Terms and Conditions</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              By using this platform, you agree to comply with our policies and
              guidelines. <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia
              delectus iure voluptatibus libero quos dolorum obcaecati
              consequatur laborum, soluta totam saepe ipsam ducimus itaque nemo
              asperiores exercitationem harum aut officiis error facere amet
              similique placeat...
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#0e1532] text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetPassword;
