import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.action";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = await params;
  const user = await getUser(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10  ">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />
          <p className="justify-items-end text-dark-600 xl:text-left ">
            © 2026 CarePulse
          </p>
          {/* <div className="text-14-regular mt-20 flex justify-between">
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div> */}
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[40%] "
      />
    </div>
  );
};

export default RegisterPage;
