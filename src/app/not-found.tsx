import Layout from "./(customer)/layout";

const NotFound: React.FC = async () => {
  return (
    <Layout>
      <div>
        <h1 className="font-bold text-4xl mb-1 text-destructive">Error 404</h1>
        <span className="font-medium">
          Page not found. Please try using the links above.
        </span>
      </div>
    </Layout>
  );
};

export default NotFound;
