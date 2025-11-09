import { useState } from 'react';
import { ConfigProvider, Layout, Typography } from 'antd';
import type { EventoSismicoSinRevisionDTO } from './types/api';
import { api } from './services/api';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import AllEvents from './components/AllEvents';
import ConfirmationModal from './components/ConfirmationModal';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

type AppState = 'list' | 'confirm-block' | 'details' | 'all-events';

function App() {
  const [state, setState] = useState<AppState>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventoSismicoSinRevisionDTO | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blockingEvent, setBlockingEvent] = useState(false);

  const handleSelectEvent = (event: EventoSismicoSinRevisionDTO) => {
    setSelectedEvent(event);
    setShowConfirmModal(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedEvent) return;

    try {
      setBlockingEvent(true);
      await api.tomarEvento(selectedEvent.id);
      setShowConfirmModal(false);
      setState('details');
    } catch {
      alert(
        'Error al bloquear el evento. Es posible que ya esté bloqueado por otro usuario o no esté disponible para revisión.'
      );
      setShowConfirmModal(false);
      setSelectedEvent(null);
    } finally {
      setBlockingEvent(false);
    }
  };

  const handleCancelBlock = () => {
    setShowConfirmModal(false);
    setSelectedEvent(null);
  };

  const handleComplete = () => {
    setState('list');
    setSelectedEvent(null);
  };

  const handleViewAllEvents = () => {
    setState('all-events');
  };

  const handleBackToList = () => {
    setState('list');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: 'linear-gradient(135deg, #001529 0%, #003366 100%)', 
          padding: '16px 50px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '3px solid #1890ff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          height: 'auto'
        }}>
          <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '28px' }}>
            🌍 Sistema de Gestión de Eventos Sísmicos
          </Title>
          <Text style={{ 
            color: 'rgba(255,255,255,0.85)', 
            fontSize: '13px', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            fontWeight: 500
          }}>
            Registro de Revisión Manual
          </Text>
        </Header>

        <Content style={{ padding: '24px 50px', background: '#f0f2f5' }}>
          {state === 'list' && <EventsList onSelectEvent={handleSelectEvent} onViewAllEvents={handleViewAllEvents} />}

          {state === 'details' && selectedEvent && (
            <EventDetails event={selectedEvent} onComplete={handleComplete} />
          )}

          {state === 'all-events' && <AllEvents onBack={handleBackToList} />}
        </Content>

        <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)' }}>
          Sistema de Gestión de Eventos Sísmicos - UTN DSI 2025
        </Footer>

        <ConfirmationModal
          isOpen={showConfirmModal}
          title="🔒 Confirmar Bloqueo de Evento"
          message={`¿Desea bloquear el evento sísmico #${selectedEvent?.id} para revisión manual?\n\nMagnitud: ${selectedEvent?.valorMagnitud}\nCoordenadas: ${selectedEvent?.coordenadas}\n\nEsto cambiará el estado del evento a "BLOQUEADO_EN_REVISION" y nadie más podrá revisarlo hasta que usted complete el proceso.`}
          onConfirm={handleConfirmBlock}
          onCancel={handleCancelBlock}
          confirmText="Bloquear y Revisar"
          cancelText="Cancelar"
          loading={blockingEvent}
        />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
