import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="KOMBIM.AZ | Sign Up"
        description="This is KOMBIM.AZ SignUp Tables Dashboard page"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
