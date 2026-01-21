import { Card } from 'react-bootstrap';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    label: string;
  };
  footer?: ReactNode;
}

const StatCard = ({
  title,
  value,
  icon,
  variant = 'primary',
  trend,
  footer,
}: StatCardProps) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {trend && (
              <small className={trend.value >= 0 ? 'text-success' : 'text-danger'}>
                <i className={`bi ${trend.value >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
                {Math.abs(trend.value)}% {trend.label}
              </small>
            )}
          </div>
          <div className={`bg-${variant} bg-opacity-10 p-3 rounded`}>
            <i className={`bi ${icon} fs-4 text-${variant}`}></i>
          </div>
        </div>
        {footer && <div className="mt-3 pt-3 border-top">{footer}</div>}
      </Card.Body>
    </Card>
  );
};

export default StatCard;
