import NavBar from './components/NavBar';
import MapComponent from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.css';
import imagePath from './assets/location-pin.png';
import './App.css';
import type { DANGER_ZONE } from "./types";
import {  REQUIRED_VERIFICATIONS } from "./types";
import { useState,useCallback } from 'react';
import {getSessionId } from './utils/index';
import { canPerformAction } from './utils/verification';
import Toast from './components/Toast';
import 'react-toastify/dist/ReactToastify.css';

// Interface للـ toast messages
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

function App() {
  // تغيير إلى array بدل object واحد
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // دالة إظهار Toast مصححة
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  // دالة إزالة Toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const [zones, setZones] = useState<DANGER_ZONE[]>([
    {
      id: '1',
      type: 'bombing',
      coordinates: [31.5017, 34.4668],
      radius: 500,
      description: 'قصف مدفعي في المنطقة',
      timestamp: new Date(),
      area: 'غزة',
      isVerified: false,
      verificationsByUsers: ['user1', 'user2'],
      reportedByUsers: ['user3'],
      endRequests: [],
      zoneStatus: 'active',
      reportedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'evacuation_area',
      coordinates: [31.5388, 34.4951],
      radius: 900,
      description: 'منطقة إخلاء للمدنيين',
      timestamp: new Date(),
      area: 'شمال غزة',
      isVerified: true,
      verificationsByUsers: ['user1', 'user2', 'user3', 'user4', 'user5'],
      reportedByUsers: [],
      endRequests: [],
      zoneStatus: 'active',
      reportedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    }
  ]);

  const handleAction = useCallback((zoneId: string, actionType: 'document' | 'report' | 'end') => {
  const sessionId = getSessionId();

  setZones(prev => prev.map(zone => {
    if (zone.id !== zoneId) return zone;

    const verification = canPerformAction(
      actionType === 'document' ? zone.verificationsByUsers :
      actionType === 'report' ? zone.reportedByUsers : zone.endRequests,
      sessionId,
      actionType
    );

    if (!verification.canPerform) {
      showToast(verification.reason || 'لا يمكن تنفيذ هذا الإجراء', 'error');
      return zone;
    }

    const updatedZone = { ...zone };

    if (actionType === 'document') {
      updatedZone.verificationsByUsers = [...zone.verificationsByUsers, sessionId];
      if (updatedZone.verificationsByUsers.length >= REQUIRED_VERIFICATIONS) {
        updatedZone.isVerified = true;
        showToast(`تم توثيق المنطقة "${zone.area}" بنجاح!`, 'success'); // أخضر
      } else {
        showToast(`تم إضافة تأكيدك (${updatedZone.verificationsByUsers.length}/${REQUIRED_VERIFICATIONS})`, 'info'); // أزرق
      }
    } else if (actionType === 'report') {
      updatedZone.reportedByUsers = [...zone.reportedByUsers, sessionId];
      if (updatedZone.reportedByUsers.length >= REQUIRED_VERIFICATIONS) {
        updatedZone.zoneStatus = 'false_report';
        showToast('تم الإبلاغ عن المنطقة وستتم إزالتها', 'warning'); // أصفر للبلاغ
      } else {
        showToast(`تم إضافة بلاغك (${updatedZone.reportedByUsers.length}/${REQUIRED_VERIFICATIONS})`, 'warning'); // أصفر للبلاغ
      }
    } else if (actionType === 'end') {
      updatedZone.endRequests = [...zone.endRequests, sessionId];
      if (updatedZone.endRequests.length >= REQUIRED_VERIFICATIONS) {
        updatedZone.zoneStatus = 'removed';
        showToast(`تم تأكيد انتهاء الخطر في "${zone.area}"`, 'error'); // أحمر لانتهاء الخطر
      } else {
        showToast(`تم طلب انتهاء الخطر (${updatedZone.endRequests.length}/${REQUIRED_VERIFICATIONS})`, 'error'); // أحمر لانتهاء الخطر
      }
    }

    return updatedZone;
  }).filter(zone => zone.zoneStatus !== 'false_report' && zone.zoneStatus !== 'removed'));
}, []);

  const handleRefresh = () => {
    showToast('تم تحديث البيانات', 'info');
  };

  const handleTogglePanel = () => {
    showToast('فتح لوحة البيانات', 'info');
  };

  return (
    <div dir='rtl' className="aman-map-app">
      <NavBar 
        logoName='AmanMap' 
        imgSrPath={imagePath}
        onRefresh={handleRefresh}
        onTogglePanel={handleTogglePanel} 
      />
      <MapComponent zones={zones} onAction={handleAction} />

      {/* عرض Multiple Toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;