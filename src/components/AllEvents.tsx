import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Alert, Spin, Typography, Statistic, Row, Col } from 'antd';
import { 
  ReloadOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { EventoSismicoDTO } from '../types/api';
import { api } from '../services/api';

const { Title, Text } = Typography;

interface AllEventsProps {
  onBack: () => void;
}

export default function AllEvents({ onBack }: AllEventsProps) {
  const [events, setEvents] = useState<EventoSismicoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllEventos();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStateColor = (estado: string): string => {
    const colorMap: Record<string, string> = {
      'PteDeRevision': 'orange',
      'AutoDetectado': 'blue',
      'BloqueadoEnRevision': 'red',
      'Confirmado': 'green',
      'Rechazado': 'default',
      'Derivado': 'purple',
      'AutoConfirmado': 'cyan',
      'PteDeCierre': 'gold',
      'Cerrado': 'default',
      'Anulado': 'default',
    };
    return colorMap[estado] || 'default';
  };

  const getStateIcon = (estado: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Confirmado': <CheckCircleOutlined />,
      'Rechazado': <CloseCircleOutlined />,
      'PteDeRevision': <ClockCircleOutlined />,
      'AutoDetectado': <ExclamationCircleOutlined />,
      'BloqueadoEnRevision': <ThunderboltOutlined />,
    };
    return iconMap[estado] || null;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left' as const,
      render: (id: number) => <strong>#{id}</strong>,
    },
    {
      title: 'Fecha Ocurrencia',
      dataIndex: 'fechaHoraOcurrencia',
      key: 'fechaOcurrencia',
      width: 180,
      render: (fecha: string) => formatDate(fecha),
    },
    {
      title: 'Magnitud',
      dataIndex: 'valorMagnitud',
      key: 'magnitud',
      width: 100,
      align: 'center' as const,
      render: (valor: number) => (
        <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {valor}
        </Tag>
      ),
    },
    {
      title: 'Magnitud Richter',
      key: 'richter',
      width: 150,
      render: (_: unknown, record: EventoSismicoDTO) => (
        record.magnitudRichterValor ? (
          <Space direction="vertical" size="small">
            <Tag color="volcano">{record.magnitudRichterValor}</Tag>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.magnitudRichterDescripcion}
            </Text>
          </Space>
        ) : <Text type="secondary">N/A</Text>
      ),
    },
    {
      title: 'Coordenadas',
      dataIndex: 'coordenadas',
      key: 'coordenadas',
      width: 200,
      render: (coords: string) => <Text code>{coords}</Text>,
    },
    {
      title: 'Estado',
      dataIndex: 'estadoDescripcion',
      key: 'estado',
      width: 180,
      render: (estado: string) => (
        <Tag icon={getStateIcon(estado)} color={getStateColor(estado)}>
          {estado}
        </Tag>
      ),
    },
    {
      title: 'Clasificación',
      dataIndex: 'clasificacion',
      key: 'clasificacion',
      width: 130,
      render: (clasificacion: string | null) => 
        clasificacion ? <Tag color="blue">{clasificacion}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Origen',
      dataIndex: 'origen',
      key: 'origen',
      width: 120,
      render: (origen: string | null) => 
        origen ? <Tag color="green">{origen}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Alcance',
      dataIndex: 'alcance',
      key: 'alcance',
      width: 130,
      render: (alcance: string | null) => 
        alcance ? <Tag color="purple">{alcance}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Radio (km)',
      dataIndex: 'radioAlcanceKm',
      key: 'radio',
      width: 110,
      align: 'right' as const,
      render: (radio: number | null) => 
        radio ? radio.toFixed(1) : <Text type="secondary">-</Text>,
    },
    {
      title: 'Último Cambio',
      dataIndex: 'fechaUltimoCambioEstado',
      key: 'ultimoCambio',
      width: 180,
      render: (fecha: string | null) => formatDate(fecha),
    },
  ];

  // Calculate statistics
  const stats = {
    total: events.length,
    pendingReview: events.filter(e => 
      e.estadoDescripcion === 'PteDeRevision' || e.estadoDescripcion === 'AutoDetectado'
    ).length,
    confirmed: events.filter(e => e.estadoDescripcion === 'Confirmado').length,
    rejected: events.filter(e => e.estadoDescripcion === 'Rechazado').length,
    inReview: events.filter(e => e.estadoDescripcion === 'BloqueadoEnRevision').length,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
      {/* Header */}
      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Title level={3} style={{ margin: 0 }}>
              📊 Todos los Eventos Sísmicos
            </Title>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadEvents}
                loading={loading}
              >
                Actualizar
              </Button>
              <Button 
                type="primary" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack}
              >
                Volver a Revisión Manual
              </Button>
            </Space>
          </Space>
          <Text type="secondary">
            Vista completa de todos los eventos registrados en el sistema
          </Text>
        </Space>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic 
              title="Total" 
              value={stats.total} 
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic 
              title="Pendientes de Revisión" 
              value={stats.pendingReview} 
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic 
              title="En Revisión" 
              value={stats.inReview} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic 
              title="Confirmados" 
              value={stats.confirmed} 
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic 
              title="Rechazados" 
              value={stats.rejected} 
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Events Table */}
      <Card>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" danger onClick={loadEvents}>
                Reintentar
              </Button>
            }
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="Cargando eventos..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={events.map(event => ({ ...event, key: event.id }))}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total: number) => `Total: ${total} eventos`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 1800 }}
            size="middle"
            bordered
          />
        )}
      </Card>
    </Space>
  );
}
