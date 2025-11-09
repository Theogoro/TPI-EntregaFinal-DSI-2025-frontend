import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Alert, Spin, Typography, Card } from 'antd';
import { ReloadOutlined, ThunderboltOutlined, ArrowUpOutlined, ArrowDownOutlined, EnterOutlined } from '@ant-design/icons';
import type { EventoSismicoSinRevisionDTO } from '../types/api';
import { api } from '../services/api';

const { Title, Text } = Typography;

interface EventsListProps {
  onSelectEvent: (event: EventoSismicoSinRevisionDTO) => void;
}

export default function EventsList({ onSelectEvent }: EventsListProps) {
  const [events, setEvents] = useState<EventoSismicoSinRevisionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (events.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(events.length - 1, prev + 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (events[selectedIndex]) {
            onSelectEvent(events[selectedIndex]);
          }
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey) {
            e.preventDefault();
            loadEvents();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [events, selectedIndex, onSelectEvent]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEventosSinRevision();
      setEvents(data);
      setSelectedIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <strong>#{id}</strong>,
    },
    {
      title: 'Fecha y Hora',
      dataIndex: 'fechaHoraOcurrencia',
      key: 'fecha',
      render: (fecha: string) => formatDate(fecha),
    },
    {
      title: 'Magnitud',
      dataIndex: 'valorMagnitud',
      key: 'magnitud',
      width: 120,
      align: 'center' as const,
      render: (magnitud: number) => (
        <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold', padding: '4px 12px' }}>
          <ThunderboltOutlined /> {magnitud}
        </Tag>
      ),
    },
    {
      title: 'Coordenadas',
      dataIndex: 'coordenadas',
      key: 'coordenadas',
      render: (coords: string) => <code style={{ background: '#f0f2f5', padding: '4px 8px', borderRadius: '4px' }}>{coords}</code>,
    },
    {
      title: 'Acción',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: EventoSismicoSinRevisionDTO) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            onSelectEvent(record);
          }}
        >
          Revisar
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Spin size="large" tip="Cargando eventos pendientes de revisión..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <Alert
          message="Error al cargar eventos"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={loadEvents} icon={<ReloadOutlined />}>
              Reintentar (Ctrl+R)
            </Button>
          }
        />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <Alert
          message="Sin eventos pendientes"
          description="✅ No hay eventos pendientes de revisión en este momento."
          type="success"
          showIcon
          action={
            <Button size="small" onClick={loadEvents} icon={<ReloadOutlined />}>
              Actualizar (Ctrl+R)
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '20px' }}>
      <Card
        title={
          <Space direction="vertical" size="small">
            <Title level={2} style={{ margin: 0 }}>
              🔍 Eventos Sísmicos Pendientes de Revisión
            </Title>
            <Text type="secondary">Selecciona un evento para revisar</Text>
          </Space>
        }
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={loadEvents}
            title="Ctrl+R para actualizar"
          >
            Actualizar
          </Button>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
          <Alert
            message={
              <Space>
                <ArrowUpOutlined /><ArrowDownOutlined /> Navegar
                <EnterOutlined /> Seleccionar
                <Text keyboard>Ctrl+R</Text> Actualizar
              </Space>
            }
            type="info"
            banner
          />
        </Space>

        <Table
          columns={columns}
          dataSource={events}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total: ${total} evento${total !== 1 ? 's' : ''}` }}
          rowClassName={(_, index) => index === selectedIndex ? 'ant-table-row-selected' : ''}
          onRow={(record, index) => ({
            onClick: () => onSelectEvent(record),
            style: { cursor: 'pointer' },
            className: index === selectedIndex ? 'ant-table-row-selected' : '',
          })}
        />
      </Card>
    </div>
  );
}
