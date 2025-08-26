import React, { useState } from 'react';
import { DANGER_COLORS, REPORT_TYPE_LABELS } from '../types';
import type { DANGER_ZONE } from '../types';

interface ReportFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (type: DANGER_ZONE['type'], description: string) => void;
    coordinates: [number, number] | null;
}

const ReportForm: React.FC<ReportFormProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    coordinates 
}) => {
    const [selectedType, setSelectedType] = useState<DANGER_ZONE['type'] | null>(null);
    const [description, setDescription] = useState('');

    const dangerTypes: { type: DANGER_ZONE['type']; label: string; color: string }[] = 
        Object.entries(REPORT_TYPE_LABELS).map(([type, label]) => ({
            type: type as DANGER_ZONE['type'],
            label,
            color: DANGER_COLORS[type as keyof typeof DANGER_COLORS]
        }));

    React.useEffect(() => {
        console.log('ReportForm - حالة المودال:', { isOpen, coordinates });
    }, [isOpen, coordinates]);

    const handleSubmit = () => {
        console.log('محاولة إرسال النموذج:', { selectedType, description });
        if (selectedType) {
            onSubmit(selectedType, description.trim());
            resetForm();
        } else {
            console.log('النموذج غير مكتمل');
        }
    };

    const resetForm = () => {
        setSelectedType(null);
        setDescription('');
    };

    const handleClose = () => {
        console.log('إغلاق المودال');
        resetForm();
        onClose();
    };

    console.log('ReportForm - سيتم الرندر:', { isOpen });

    if (!isOpen) {
        console.log('المودال مخفي');
        return null;
    }

    console.log('المودال سيظهر الآن!');

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999, 
                direction: 'rtl'
            }}
            onClick={handleClose}
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                    maxWidth: '420px',
                    width: '90%',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    fontFamily: "'Cairo', 'Segoe UI', sans-serif"
                }}
            >
                <div>
                    <h3>تحديد منطقة خطر</h3>
                </div>

                <div>
                    <div>
                        <label>نوع الخطر</label>
                        
                        {dangerTypes.map((danger) => (
                            <div key={danger.type}>
                                <label>
                                    <input
                                        type="radio"
                                        name="dangerType"
                                        checked={selectedType === danger.type}
                                        onChange={() => setSelectedType(danger.type)}
                                    />
                                    <span 
                                        className="custom-checkbox"
                                        style={{ 
                                            backgroundColor: selectedType === danger.type ? danger.color : 'white',
                                            borderColor: danger.color 
                                        }}
                                    >
                                        {selectedType === danger.type}
                                    </span>
                                    <span>{danger.label}</span>
                                </label>
                                <div 
                                    style={{ backgroundColor: danger.color }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label>تفاصيل إضافية (اختياري)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="اكتب أي تفاصيل إضافية حول منطقة الخطر..."
                            rows={3}
                            maxLength={300}
                        />
                        <div>{description.length}/300</div>
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleClose}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedType}
                        style={{
                            backgroundColor: selectedType ? 
                                DANGER_COLORS[selectedType] : '#9ca3af'
                        }}
                    >
                        إضافة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportForm;