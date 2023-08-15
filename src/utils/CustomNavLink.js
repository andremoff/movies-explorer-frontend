import { useMatch, Link } from 'react-router-dom';

function CustomNavLink({ to, activeClassName, children, ...rest }) {
  const match = useMatch(to);

  return (
    <Link to={to} className={match ? activeClassName : ''} {...rest}>
      {children}
    </Link>
  );
}

export default CustomNavLink;
