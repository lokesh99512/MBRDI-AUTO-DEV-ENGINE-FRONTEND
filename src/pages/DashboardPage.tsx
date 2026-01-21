import { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStatsRequest, fetchActivityRequest } from '@/features/dashboard/dashboardSlice';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ActivityItem } from '@/types';
import { format } from 'date-fns';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivity, loading } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchActivityRequest(5));
  }, [dispatch]);

  const activityColumns = [
    { key: 'action', label: 'Action', sortable: true },
    { key: 'projectName', label: 'Project', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    {
      key: 'timestamp',
      label: 'Time',
      render: (item: ActivityItem) => format(new Date(item.timestamp), 'MMM dd, HH:mm'),
    },
  ];

  if (loading && !stats) {
    return <MainLayout><LoadingSpinner fullPage text="Loading dashboard..." /></MainLayout>;
  }

  return (
    <MainLayout>
      <Container fluid className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Welcome back, {user?.firstName}!</h4>
            <p className="text-muted mb-0">Here's what's happening with your projects.</p>
          </div>
          <Link to="/projects/new">
            <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>New Project</Button>
          </Link>
        </div>

        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon="bi-folder" variant="primary" />
          </Col>
          <Col md={6} lg={3}>
            <StatCard title="AI Generations" value={stats?.aiGenerations || 0} icon="bi-cpu" variant="success" />
          </Col>
          <Col md={6} lg={3}>
            <StatCard title="Usage Rate" value={`${stats?.usageStats || 0}%`} icon="bi-graph-up" variant="info" />
          </Col>
          <Col md={6} lg={3}>
            <StatCard title="Active Users" value={stats?.activeUsers || 0} icon="bi-people" variant="warning" />
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <h5 className="mb-3">Recent Activity</h5>
            <DataTable columns={activityColumns} data={recentActivity} loading={loading} emptyMessage="No recent activity" />
          </Col>
          <Col lg={4}>
            <h5 className="mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              <Link to="/projects/new" className="btn btn-outline-primary"><i className="bi bi-plus-circle me-2"></i>Create New Project</Link>
              <Link to="/projects" className="btn btn-outline-secondary"><i className="bi bi-clock-history me-2"></i>View History</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
