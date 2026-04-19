const RegisterPage = ({ params }: { params: { userId: string } }) => {
  return (
    <div>
      <h1>Register Patient {params.userId}</h1>
    </div>
  );
};

export default RegisterPage;
