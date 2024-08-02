import { useForm, Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../services/authApi";

type FormValues = {
  email: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

const Login = () => {
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await loginUser(data);

      if (response?.data?.success === true) {
        toast.success(response?.data?.message, { autoClose: 2000 });
        reset();
        navigate("/profile");
      } else {
        toast.error("Error in logging in");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in logging in");
    }
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md focus:outline-none border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
