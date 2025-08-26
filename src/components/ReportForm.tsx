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
        <div className="modal-container" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {/*  لازم أضيف icon هنا لبعدين  */}
                    <h3>تحديد منطقة خطر </h3>
                </div>

                {/* أنواع الأخطار */}
                <div className="danger-types-container">
                    <div className="danger-types-title">اختر نوع الخطر:</div>

                    {dangerTypes.map((danger) => (
                        <div
                            key={danger.type}
                            className={`danger-type-item ${selectedType === danger.type ? 'danger-type-item--selected' : ''}`}
                            onClick={() => setSelectedType(danger.type)}
                        >
                            <div
                                className="danger-type-color-dot"
                                style={{ backgroundColor: danger.color }}
                            ></div>
                            <div
                                className="danger-type-checkbox"
                                style={{ borderColor: danger.color }}
                            >
                                {selectedType === danger.type && (
                                    <div
                                        className="danger-type-checkbox-inner"
                                        style={{ backgroundColor: danger.color }}
                                    ></div>
                                )}
                            </div>

                            <span className="danger-type-label">{danger.label}</span>
                        </div>
                    ))}
                </div>
                <div className="textarea-container">
                    <div className="textarea-label">تفاصيل إضافية (اختياري):</div>
                    <textarea
                        className="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="اكتب أي تفاصيل إضافية..."
                        rows={2}
                        maxLength={300}
                    />
                    <div className="character-count">{description.length}/300</div>
                </div>

                {/* الأزرار */}
                <div className="buttons-container">
                    <button
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={!selectedType}
                    >
                        إضافة
                    </button>
                    <button className="cancel-button" onClick={handleClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ReportForm;