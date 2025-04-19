import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="KOMBIM.AZ | Sign In"
        description="This is KOMBIM.AZ SignIn Tables Dashboard page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
