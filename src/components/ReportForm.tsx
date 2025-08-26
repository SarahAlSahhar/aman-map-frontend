// import { useState } from 'react';
// import { REPORT_TYPE_LABELS, DANGER_COLORS } from '../types';

// interface ReportFormProps {
//     position: [number, number] | null;
//     onSubmit: (formData: any) => void;
//     onCancel: () => void;
// }

// const ReportForm: React.FC<ReportFormProps> = ({ position, onSubmit, onCancel }) => {
//     const [formData, setFormData] = useState({
//         type: 'bombing',
//         description: '',
//         area: 'غزة',
//         radius: 200,
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit({
//             ...formData,
//             coordinates: position,
//         });
//     };

//    const handleChange = (field: string, value: string | number) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content report-form">
//                 <div className="modal-header">
//                     <h3>إضافة منطقة خطر جديدة</h3>
//                     <button onClick={onCancel} className="close-btn">×</button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label>المنطقة</label>
//                         <select
//                             value={formData.area}
//                             onChange={(e) => handleChange('area', e.target.value)}
//                             className="form-select"
//                         >
//                             <option value="غزة">غزة</option>
//                             <option value="شمال غزة">شمال غزة</option>
//                             <option value="الوسطى">الوسطى</option>
//                             <option value="خان يونس">خان يونس</option>
//                             <option value="رفح">رفح</option>
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label>نوع الخطر</label>
//                         <div className="danger-type-grid">
//                             {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
//                                 <button
//                                     key={value}
//                                     type="button"
//                                     className={type-btn ${formData.type === value ? 'active' : ''}}
//                                     onClick={() => handleChange('type', value)}
//                                     style={{
//                                         borderColor: DANGER_COLORS[value as keyof typeof DANGER_COLORS],
//                                         color: formData.type === value ? 'white' : DANGER_COLORS[value as keyof typeof DANGER_COLORS],
//                                         backgroundColor: formData.type === value ? DANGER_COLORS[value as keyof typeof DANGER_COLORS] : 'transparent'
//                                     }}
//                                 >
//                                     {label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <label>نطاق الخطر: {formData.radius} متر</label>
//                         <input
//                             type="range"
//                             min="100"
//                             max="1000"
//                             step="50"
//                             value={formData.radius}
//                             onChange={(e) => handleChange('radius', parseInt(e.target.value))}
//                             className="radius-slider"
//                         />
//                         <div className="radius-labels">
//                             <span>100م</span>
//                             <span>1000م</span>
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <label>تفاصيل الخطر</label>
//                         <textarea
//                             value={formData.description}
//                             onChange={(e) => handleChange('description', e.target.value)}
//                             placeholder="اكتب تفاصيل الوضع في المنطقة..."
//                             rows={3}
//                             required
//                             className="form-textarea"
//                         />
//                     </div>

//                     <div className="coordinates-info">
//                         📍 الموقع: {position?.[0].toFixed(4)}, {position?.[1].toFixed(4)}
//                     </div>

//                     <div className="form-actions">
//                         <button type="submit" className="btn-submit">
//                             إضافة المنطقة
//                         </button>
//                         <button type="button" onClick={onCancel} className="btn-cancel">
//                             إلغاء
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
// export default ReportForm;



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