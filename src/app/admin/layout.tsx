import Nav, { NavLink } from "@components/partials/Nav";

// No caching.
export const dynamic = "force-dynamic";

const layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
};

export default layout;
