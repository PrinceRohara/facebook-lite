import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function LoginForm() {
  const defaultFeilds = {
    username: "",
    password: "",
  };
  const [form, setForm] = useState(defaultFeilds);
  const [error, setError] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);

  const handeChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }
      const mes = await res.json();

      if (res.ok) {
        const { user } = mes;

        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");

        // setForm(defaultFeilds);
      } else if (res.status === 400) {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 ">
          <div>
            <label htmlFor="email" className="sr-only">
              User Name
            </label>
            <input
              name="username"
              onChange={handeChange}
              value={form.username}
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="User Name"
            />
            {error ? (
              <span className="text-red-500 ">Username Already Exists</span>
            ) : (
              ""
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              onChange={handeChange}
              value={form.password}
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          {unauthorized && (
            <span className="text-md text-red-500">
              Username or password is incorrect
            </span>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
            >
              Sign Up
            </button>
          </div>
        </form>
        <span className="mt-4 text-blue-400 ">
          {" "}
          <Link to="/signup">Create an Account</Link>
        </span>
      </div>
    </div>
  );
}
