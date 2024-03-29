const Header: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <h1 className="text-4xl mb-4">{children}</h1>;
};

export default Header;
