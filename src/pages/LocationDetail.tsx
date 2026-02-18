import { useParams } from "react-router-dom";

const LocationDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Location Detail</h1>
      <p className="text-muted-foreground">Location ID: {id}</p>
    </div>
  );
};

export default LocationDetail;
