import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type FormValues = {
  userName: string;
  email: string;
  password: string;
};

type FormErrors = {
  userName?: {
    type: string;
    message: string;
  };
  email?: {
    type: string;
    message: string;
  };
  password?: {
    type: string;
    message: string;
  };
};

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FormErrors = {};

  if (!values.userName) {
    errors.userName = {
      type: "required",
      message: "Username is required.",
    };
  }

  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = {
      type: "pattern",
      message: "Email format is invalid.",
    };
  }

  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  } else if (values.password.length < 6) {
    errors.password = {
      type: "minLength",
      message: "Password must be at least 6 characters.",
    };
  }

  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};

const Register = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post("https://api.adityasinghrawat.com/register", data);

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        Navigate("/login");
      } else if (response?.data?.success === false) {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An unexpected error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              {...register("userName")}
              placeholder="Enter username"
              className={`w-full p-2 border rounded ${
                errors.userName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("email")}
              placeholder="Enter email"
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <input
              {...register("password")}
              placeholder="Enter password"
              type="password"
              className={`w-full p-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
