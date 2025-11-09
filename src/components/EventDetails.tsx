import { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Table,
  Space,
  Button,
  Result,
  Spin,
  Alert,
  Tag,
  Typography,
  Row,
  Col,
  Tabs,
} from 'antd';
import {
  ThunderboltOutlined,
  GlobalOutlined,
  EditOutlined,
  ArrowRightOutlined,
  LineChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type {
  EventoSismicoSinRevisionDTO,
  DatosRegistradosDTO,
  SismogramaDTO,
} from '../types/api';
import { api } from '../services/api';
import ConfirmationModal from './ConfirmationModal';

const { Title, Text, Paragraph } = Typography;

interface EventDetailsProps {
  event: EventoSismicoSinRevisionDTO;
  onComplete: () => void;
}

type Step =
  | 'loading'
  | 'show-data'
  | 'show-seismograms'
  | 'ask-map'
  | 'ask-modify'
  | 'ask-action'
  | 'confirm-reject'
  | 'completed'
  | 'error';

export default function EventDetails({ event, onComplete }: EventDetailsProps) {
  const [step, setStep] = useState<Step>('loading');
  const [datosRegistrados, setDatosRegistrados] = useState<DatosRegistradosDTO | null>(null);
  const [sismogramas, setSismogramas] = useState<SismogramaDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    loadEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 'show-data' || step === 'show-seismograms' || step === 'ask-map' || step === 'ask-modify' || step === 'ask-action') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (showModal) return;

        if (step === 'show-data' && e.key === 'Enter') {
          e.preventDefault();
          handleShowSeismograms();
        } else if (step === 'show-seismograms' && e.key === 'Enter') {
          e.preventDefault();
          handleAskMap();
        } else if (step === 'ask-map' && (e.key === 'n' || e.key === 'N')) {
          e.preventDefault();
          handleNoMap();
        } else if (step === 'ask-modify' && (e.key === 'n' || e.key === 'N')) {
          e.preventDefault();
          handleNoModify();
        } else if (step === 'ask-action') {
          if (e.key === '1' || e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            handleReject();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, showModal]);

  const loadEventDetails = async () => {
    try {
      setStep('loading');
      const [datos, sismos] = await Promise.all([
        api.getDatosRegistrados(event.id),
        api.getSismogramas(event.id),
      ]);
      setDatosRegistrados(datos);
      setSismogramas(sismos);
      setStep('show-data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading event details');
      setStep('error');
    }
  };

  const handleShowSeismograms = () => {
    setStep('show-seismograms');
  };

  const handleAskMap = () => {
    setStep('ask-map');
  };

  const handleNoMap = () => {
    setStep('ask-modify');
  };

  const handleNoModify = () => {
    setStep('ask-action');
  };

  const handleReject = () => {
    setModalConfig({
      title: '⚠️ Confirmar Rechazo',
      message: `¿Está seguro que desea rechazar el evento sísmico #${event.id}?\n\nEsta acción cambiará el estado del evento a "RECHAZADO".`,
      onConfirm: async () => {
        try {
          await api.rechazarEvento(event.id);
          setShowModal(false);
          setStep('completed');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error rejecting event');
          setShowModal(false);
          setStep('error');
        }
      },
      onCancel: () => {
        setShowModal(false);
      },
    });
    setShowModal(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (step === 'loading') {
    return (
      <Card style={{ marginTop: 24 }}>
        <Spin size="large" tip="Cargando datos del evento sísmico...">
          <div style={{ minHeight: 200 }} />
        </Spin>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card style={{ marginTop: 24 }}>
        <Result
          status="error"
          title="Error al cargar el evento"
          subTitle={error}
          extra={
            <Button type="primary" onClick={onComplete}>
              Volver a la lista
            </Button>
          }
        />
      </Card>
    );
  }

  if (step === 'completed') {
    return (
      <Card style={{ marginTop: 24 }}>
        <Result
          status="success"
          title="Evento Rechazado Exitosamente"
          subTitle={
            <>
              <Paragraph>Evento #{event.id}</Paragraph>
              <Paragraph>El evento sísmico ha sido rechazado y su estado ha sido actualizado.</Paragraph>
              <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                ✓ Fin Caso de Uso
              </Tag>
            </>
          }
          extra={
            <Button type="primary" size="large" onClick={handleComplete}>
              Volver a la lista (Enter)
            </Button>
          }
        />
      </Card>
    );
  }

  // TODO: Esta visualización usa datos simulados para demostración.
  // En el futuro, se implementará la generación real de sismogramas a partir de los datos de la API.
  // Generate realistic seismic wave data for visualization (MOCK DATA)
  const generateRealisticSeismogram = () => {
    const data = [];
    const totalPoints = 200;
    const epicenterPoint = 100; // Punto donde ocurre el evento principal
    
    for (let i = 0; i < totalPoints; i++) {
      let amplitude = 0;
      
      // Pre-evento: ruido de fondo muy bajo
      if (i < epicenterPoint - 20) {
        amplitude = (Math.random() - 0.5) * 0.5;
      }
      // Ondas P (primarias): primeras ondas sísmicas
      else if (i >= epicenterPoint - 20 && i < epicenterPoint - 5) {
        const distance = i - (epicenterPoint - 20);
        amplitude = Math.sin(distance * 0.8) * (distance * 0.3) + (Math.random() - 0.5) * 0.5;
      }
      // Evento principal: mayor amplitud con oscilaciones fuertes
      else if (i >= epicenterPoint - 5 && i < epicenterPoint + 30) {
        const distance = i - epicenterPoint;
        const envelope = Math.exp(-Math.abs(distance) / 15); // Decaimiento exponencial
        amplitude = Math.sin(distance * 1.2) * envelope * 20 + 
                   Math.sin(distance * 2.5) * envelope * 15 +
                   Math.sin(distance * 4) * envelope * 8 +
                   (Math.random() - 0.5) * 2;
      }
      // Ondas S (secundarias): después del evento principal
      else if (i >= epicenterPoint + 30 && i < epicenterPoint + 60) {
        const distance = i - (epicenterPoint + 30);
        const envelope = Math.exp(-distance / 20);
        amplitude = Math.sin(distance * 0.9) * envelope * 8 +
                   Math.sin(distance * 2) * envelope * 4 +
                   (Math.random() - 0.5) * 1;
      }
      // Post-evento: decaimiento gradual
      else {
        const distance = i - (epicenterPoint + 60);
        const envelope = Math.exp(-distance / 30);
        amplitude = Math.sin(distance * 0.5) * envelope * 2 + 
                   (Math.random() - 0.5) * 0.5;
      }
      
      data.push({
        index: i,
        velocidad: amplitude,
        tiempo: i * 0.1, // 0.1 segundos por muestra
      });
    }
    
    return data;
  };

  const seismogramColumns = [
    {
      title: 'Longitud',
      dataIndex: 'longitud',
      key: 'longitud',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Frecuencia',
      dataIndex: 'frecuencia',
      key: 'frecuencia',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: 'Velocidad',
      dataIndex: 'velocidad',
      key: 'velocidad',
      render: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
      {/* Header Card */}
      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={3} style={{ margin: 0 }}>
            📋 Detalles del Evento Sísmico
          </Title>
          <Tag color="blue" style={{ fontSize: '14px' }}>
            Evento #{event.id}
          </Tag>
        </Space>
      </Card>

      {/* Basic Information */}
      <Card title="Información General" bordered={false}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Fecha y Hora de Ocurrencia">
            {formatDate(event.fechaHoraOcurrencia)}
          </Descriptions.Item>
          <Descriptions.Item label="Magnitud">
            <Tag color="red" style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {event.valorMagnitud}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Coordenadas (Epicentro)">
            <Text code>{event.coordenadas}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Registered Data - Only in show-data step */}
      {step === 'show-data' && datosRegistrados && (
        <Card title="Datos Registrados" bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Clasificación">
              <Tag color="blue">{datosRegistrados.clasificacion}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Clasificación Richter">
              <Tag color="red">{datosRegistrados.clasificacionRichter}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Origen">
              <Tag color="green">{datosRegistrados.origen}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Alcance">
              <Tag color="purple">{datosRegistrados.alcance}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Step-based Actions */}
      {step === 'show-data' && (
        <Card>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Text type="secondary">Presione Enter para ver los sismogramas</Text>
            <Button type="primary" size="large" onClick={handleShowSeismograms} icon={<ArrowRightOutlined />}>
              Ver Sismogramas (Enter)
            </Button>
          </Space>
        </Card>
      )}

      {/* Seismograms Step - Dedicated step for viewing seismograms */}
      {step === 'show-seismograms' && sismogramas.length > 0 && (
        <>
          <Card title={
            <Space>
              <ThunderboltOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Title level={3} style={{ margin: 0 }}>
                Sismogramas por Estación
              </Title>
            </Space>
          } bordered={false}>
            <Alert
              message="Datos Sísmicos Registrados"
              description={`Se encontraron ${sismogramas.length} estaciones con datos sísmicos para este evento.`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {sismogramas.map((sisma, index) => (
                <Card 
                  key={index} 
                  type="inner" 
                  title={`📡 ${sisma.estacion}`} 
                  size="small"
                  extra={<Tag color="blue">{sisma.datos.length} registros</Tag>}
                >
                  <Tabs
                    defaultActiveKey="graph"
                    items={[
                      {
                        key: 'graph',
                        label: (
                          <span>
                            <LineChartOutlined /> Gráfico
                          </span>
                        ),
                        children: (
                          <div style={{ width: '100%' }}>
                            <Alert
                              message="Visualización de Demostración"
                              description="Este gráfico muestra un sismograma simulado con fines demostrativos. La integración con datos reales de la API se implementará en una versión futura."
                              type="warning"
                              showIcon
                              style={{ marginBottom: 16 }}
                            />
                            <div style={{ width: '100%', height: 300, background: '#fff', border: '1px solid #d9d9d9' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={generateRealisticSeismogram()}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                  <XAxis 
                                    dataKey="tiempo" 
                                    tick={{ fontSize: 11 }}
                                    label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -15, style: { fontSize: 13, fontWeight: 'bold' } }}
                                    domain={[0, 20]}
                                  />
                                  <YAxis 
                                    domain={[-25, 25]}
                                    tick={{ fontSize: 11 }}
                                    label={{ value: 'Amplitud', angle: -90, position: 'insideLeft', style: { fontSize: 13, fontWeight: 'bold' } }}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                                      border: '1px solid #bbb',
                                      borderRadius: '4px',
                                      padding: '10px',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }}
                                    formatter={(value: number) => [`${value.toFixed(2)}`, 'Amplitud']}
                                    labelFormatter={(label: number) => `Tiempo: ${label.toFixed(2)}s`}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="velocidad" 
                                    stroke="#000000" 
                                    strokeWidth={1}
                                    dot={false}
                                    isAnimationActive={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: 'table',
                        label: (
                          <span>
                            <TableOutlined /> Tabla de Datos
                          </span>
                        ),
                        children: (
                          <>
                            <Table
                              columns={seismogramColumns}
                              dataSource={sisma.datos.slice(0, 10).map((dato, idx) => ({ ...dato, key: idx }))}
                              pagination={false}
                              size="small"
                              bordered
                            />
                            {sisma.datos.length > 10 && (
                              <Alert
                                message={`Mostrando 10 de ${sisma.datos.length} registros totales`}
                                type="info"
                                showIcon
                                style={{ marginTop: 12 }}
                              />
                            )}
                          </>
                        ),
                      },
                    ]}
                  />
                </Card>
              ))}
            </Space>
          </Card>
          
          <Card>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Text type="secondary">Presione Enter para continuar</Text>
              <Button type="primary" size="large" onClick={handleAskMap} icon={<ArrowRightOutlined />}>
                Continuar (Enter)
              </Button>
            </Space>
          </Card>
        </>
      )}

      {step === 'ask-map' && (
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={4}>
              <GlobalOutlined /> ¿Desea visualizar el mapa del evento y las estaciones?
            </Title>
            <Alert
              message="La visualización del mapa no está implementada en esta versión"
              type="info"
              showIcon
            />
            <Space>
              <Button onClick={() => alert('Función no implementada')} disabled>
                Sí
              </Button>
              <Button type="primary" onClick={handleNoMap}>
                No (N)
              </Button>
            </Space>
          </Space>
        </Card>
      )}

      {step === 'ask-modify' && (
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={4}>
              <EditOutlined /> ¿Desea modificar los datos del evento sísmico?
            </Title>
            <Alert
              message="La modificación de datos no está implementada en esta versión"
              type="info"
              showIcon
            />
            <Space>
              <Button onClick={() => alert('Función no implementada')} disabled>
                Sí
              </Button>
              <Button type="primary" onClick={handleNoModify}>
                No (N)
              </Button>
            </Space>
          </Space>
        </Card>
      )}

      {step === 'ask-action' && (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={4}>
              <ThunderboltOutlined /> Seleccione una acción:
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  hoverable={false}
                  style={{ textAlign: 'center', opacity: 0.6 }}
                >
                  <Space direction="vertical" size="small">
                    <Tag color="default" style={{ fontSize: '18px', padding: '8px 16px' }}>
                      1
                    </Tag>
                    <Text strong>Confirmar Evento</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      (No implementado)
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable
                  onClick={handleReject}
                  style={{ textAlign: 'center', borderColor: '#ff4d4f', cursor: 'pointer' }}
                >
                  <Space direction="vertical" size="small">
                    <Tag color="error" style={{ fontSize: '18px', padding: '8px 16px' }}>
                      2
                    </Tag>
                    <Text strong>Rechazar Evento</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      (Presione R o 1)
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  hoverable={false}
                  style={{ textAlign: 'center', opacity: 0.6 }}
                >
                  <Space direction="vertical" size="small">
                    <Tag color="default" style={{ fontSize: '18px', padding: '8px 16px' }}>
                      3
                    </Tag>
                    <Text strong>Solicitar Revisión a Experto</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      (No implementado)
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </Space>
  );
}
