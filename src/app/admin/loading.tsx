import { Loader } from "lucide-react";

const loading = () => {
  return (
    <div role="status" className="flex justify-center">
      <Loader className="size-8 animate-spin" />
    </div>
  );
};

export default loading;
