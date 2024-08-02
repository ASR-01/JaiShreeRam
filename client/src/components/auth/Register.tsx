import { useForm, Resolver } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/authApi";
import { toast } from "react-toastify";

type FormValues = {
  username: string;
  password: string;
  email: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.username ? values : {},
    errors: !values.username
      ? {
          username: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

const Register = () => {
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await registerUser(data);
      if (response?.data && response?.data?.success === true) {
        toast.success(response?.data?.message, { autoClose: 1000 });
        reset();
       navigate("/verify", { state: { email: data?.email } });
      }

      if (response?.error) {
        toast.error("User Registration Failed");
      }
    } catch (error) {
      toast.error("User Registration Failed");
    }
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <input
            {...register("username")}
            placeholder="Username"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-2 border rounded-md focus:outline-none border-gray-300"
          />
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
