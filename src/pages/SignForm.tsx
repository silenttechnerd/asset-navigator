import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const SignForm = () => {
  const { companyId, signingUrlId } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading form...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignForm;
