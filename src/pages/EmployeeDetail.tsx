import { useParams } from "react-router-dom";

const EmployeeDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Employee Detail</h1>
      <p className="text-muted-foreground">Employee ID: {id}</p>
    </div>
  );
};

export default EmployeeDetail;
