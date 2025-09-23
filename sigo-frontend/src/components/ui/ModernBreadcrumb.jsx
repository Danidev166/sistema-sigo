import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb moderno con efectos visuales
 */
const ModernBreadcrumb = ({ items = [], className = '' }) => {
  const location = useLocation();
  
  // Generar breadcrumb automáticamente si no se proporcionan items
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard', icon: Home }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbItems.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumb();
  
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path || index}>
          {index > 0 && (
            <ChevronRight 
              size={16} 
              className="text-gray-400 dark:text-gray-500 flex-shrink-0" 
            />
          )}
          {item.isLast ? (
            <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
              {item.icon && <item.icon size={16} />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 group"
            >
              {item.icon && <item.icon size={16} className="group-hover:scale-110 transition-transform duration-200" />}
              <span className="group-hover:underline">{item.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default ModernBreadcrumb;
