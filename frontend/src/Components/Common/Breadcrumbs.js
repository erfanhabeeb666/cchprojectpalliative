import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../Layout/DashboardLayout.css'; // Reusing styles for now

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <div className="breadcrumbs">
            <span className="breadcrumb-item">
                <Link to="/">Home</Link>
            </span>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Capitalize first letter
                const title = value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <span key={to} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                        {isLast ? (
                            title
                        ) : (
                            <Link to={to}>{title}</Link>
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
