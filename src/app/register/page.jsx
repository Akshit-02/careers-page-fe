"use client";

import { signIn, signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { fetchCompany } from "../../store/slices/companySlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const user = await signUp({
        username: email.toLowerCase(),
        password: password,
      });
      console.log("user", user);

      if (user.isSignUpComplete) {
        const signInUser = await signIn({
          username: email.toLowerCase(),
          password: password,
        });
        console.log("signInUser", signInUser);

        dispatch(fetchCompany(user.userId));
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5138ee]/10 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 md:p-10 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-[#5138ee] mb-2">
          Create an account
        </h1>
        <p className="text-center text-gray-600 mb-8">Sign up to get started</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          <div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <div className="flex items-center mt-1">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-[#5138ee] focus:ring-[#5138ee] border-gray-300 rounded"
              />
              <label
                htmlFor="show-password"
                className="ml-2 block text-sm text-gray-700"
              >
                Show password
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            isLoading={isLoading}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#5138ee] hover:text-[#5138ee]/80"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
