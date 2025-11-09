import { useEffect } from 'react';
import { Modal, Space, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onConfirm();
          break;
        case 'Escape':
          e.preventDefault();
          onCancel();
          break;
        case 'y':
        case 'Y':
          e.preventDefault();
          onConfirm();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          onCancel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel, loading]);

  return (
    <Modal
      open={isOpen}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={
        <Space>
          <CheckOutlined />
          {confirmText} (Y)
        </Space>
      }
      cancelText={
        <Space>
          <CloseOutlined />
          {cancelText} (N)
        </Space>
      }
      centered
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
        {!loading && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Atajos: Y/Enter para confirmar, N/Esc para cancelar
          </Text>
        )}
      </Space>
    </Modal>
  );
}
