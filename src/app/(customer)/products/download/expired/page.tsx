import Link from "next/link";
import { Button } from "@components/Button";

const ExpiredPage: React.FC = () => {
  return (
    <>
      <h1 className="text-4xl mb-4">Download Link Expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
};

export default ExpiredPage;
