import { useParams } from "react-router-dom";

const AssetDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Asset Detail</h1>
      <p className="text-muted-foreground">Asset ID: {id}</p>
    </div>
  );
};

export default AssetDetail;
