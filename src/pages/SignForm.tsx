import { useParams } from "react-router-dom";

const SignForm = () => {
  const { companyId, signingUrlId } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Document Signing</h1>
        <p className="mt-2 text-muted-foreground">
          Company: {companyId} · Signing URL: {signingUrlId}
        </p>
      </div>
    </div>
  );
};

export default SignForm;
