import LoginForm from "../../ui/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-2xl w-full bg-surface rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">
          Login
        </h1>
          <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
