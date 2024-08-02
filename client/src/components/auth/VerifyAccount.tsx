import { useForm, Resolver } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyUserMutation } from "../../services/authApi";
import { useEffect } from "react";

type FormValues = {
  otp: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.otp ? values : {},
    errors: !values.otp
      ? {
          otp: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

const VerifyAccount = () => {
  const [verifyUser] = useVerifyUserMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    const toastId = toast.success("Email has been sent to your account");

    return () => {
      toast.dismiss(toastId);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await verifyUser({ otp: data.otp, email });
      if (response?.data && response?.data?.success === true) {
        toast.success(response?.data?.message, { autoClose: 2000 });
        reset();
        navigate("/login");
      }

      if (response?.error) {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Invalid OTP");
    }
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Enter OTP</h1>
        <div className="mb-4">
          <input
            {...register("otp")}
            placeholder="...otp"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.otp ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.otp && (
            <p className="text-red-500 text-sm">{errors.otp.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
