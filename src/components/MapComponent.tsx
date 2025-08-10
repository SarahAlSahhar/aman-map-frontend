import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon, DivIcon, point } from "leaflet";
import 'leaflet/dist/leaflet.css';
// import markerIcon from '../assets/marker.png';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { DANGER_COLORS } from "../types";
import type { DANGER_ZONE } from "../types";
import { ACTION_LABELS, REQUIRED_VERIFICATIONS, DEFAULT_ZONE_RADIUS } from "../types";
import { getSessionId } from "../utils";
import { canPerformAction } from "../utils/verification";
import { timeAgo } from "../utils";


interface MapComponentProps {
    zones: DANGER_ZONE[];
    onAction: (zoneId: string, actionType: 'document' | 'report' | 'end') => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ zones, onAction }) => {
    const GAZA_CENTER: [number, number] = [31.5017, 34.4668];

    //instead of the markers Testttt
    // const zones: DANGER_ZONE[] = [
    //     {
    //         id: '1',
    //         type: 'bombing',
    //         coordinates: [31.5017, 34.4668],
    //         description: 'قصف في المنطقة',
    //         timestamp: new Date(),
    //         area: 'غزة',
    //         verified: false
    //     },
    //     {
    //         id: '2',
    //         type: 'evacuation_area',
    //         coordinates: [31.5388, 34.4951],
    //         description: 'منطقة إخلاء ',
    //         timestamp: new Date(),
    //         area: 'شمال غزة',
    //         verified: true
    //     },
    //     {
    //         id: '3',
    //         type: 'gunfire',
    //         coordinates: [31.3505, 34.2936],
    //         description: 'إطلاق نار متقطع',
    //         timestamp: new Date(),
    //         area: 'خان يونس',
    //         verified: false
    //     }
    // ];

    // const markers = [{
    //     geocode: [31.5017, 34.4668],
    //     popup: "This is a popup!"
    // }, {
    //     geocode: [31.5388, 34.4951],
    //     popup: "This is a popup! 2222"
    // }, {
    //     geocode: [31.3505, 34.2936],
    //     popup: "This is a popup! Saluuut"
    // }
    // ]


    const customIcon = (type: string) => {
        const color = DANGER_COLORS[type as keyof typeof DANGER_COLORS];
        return new Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" fill="${color}" opacity="0.3"/>
                    <circle cx="16" cy="16" r="10" fill="${color}"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
            `)}`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    // const customIcon = new Icon({
    //     // iconUrl: "https://cdn-icons-png.flaticon.com/128/1397/1397898.png"
    //     iconUrl: markerIcon,
    //     iconSize: [38, 38]
    // });

    const createCustomClusterIcon = (cluster) => {
        return new DivIcon({
            html: `<div class="salut" >
            <strong>${cluster.getChildCount()}</strong></div>`,
            className: "custom-marker-cluster",
            iconSize: point(33, 33, true)
        });
    };

    return (
        <MapContainer center={GAZA_CENTER} zoom={12} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                attribution='<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
                url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
            />

            {zones.map((zone) => (
                <Circle
                    key={`circle-${zone.id}`}
                    center={zone.coordinates}
                    radius={zone.radius || DEFAULT_ZONE_RADIUS}
                    pathOptions={{
                        color: DANGER_COLORS[zone.type],
                        fillColor: DANGER_COLORS[zone.type],
                        fillOpacity: 0.2,
                        weight: 2,
                    }}
                />
            ))}

            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createCustomClusterIcon}
            >
                {zones.map((zone) => (
                    <Marker
                        key={zone.id}
                        position={zone.coordinates}
                        icon={customIcon(zone.type)}
                    >
                        <Popup>
                            {/* نفس محتوى الـ popup... */}
                            <div>
                                <div className="popup-header">
                                    <h4>{zone.area}</h4>
                                    {zone.isVerified && <span className="verified-badge"> موثق</span>}
                                </div>

                                <div className="popup-details">
                                    <p><strong>النوع:</strong> {zone.type}</p>
                                    <p><strong>التفاصيل:</strong> {zone.description}</p>
                                    <div className="time-info">
                                        {timeAgo(zone.timestamp)}
                                    </div>
                                    <p><strong>التوثيقات:</strong> {zone.verificationsByUsers.length}/{REQUIRED_VERIFICATIONS}</p>
                                </div>

                                <div className="popup-actions">
                                    <button
                                        className="popup-btn verify"
                                        onClick={() => onAction(zone.id, 'document')}
                                        disabled={!canPerformAction(zone.verificationsByUsers, getSessionId(), 'document').canPerform}
                                    >
                                        {ACTION_LABELS.document} ({zone.verificationsByUsers.length}/5)
                                    </button>

                                    <button
                                        className="popup-btn report"
                                        onClick={() => onAction(zone.id, 'report')}
                                        disabled={!canPerformAction(zone.reportedByUsers, getSessionId(), 'report').canPerform}
                                    >
                                        {ACTION_LABELS.report} ({zone.reportedByUsers.length}/5)
                                    </button>

                                    <button
                                        className="popup-btn end"
                                        onClick={() => onAction(zone.id, 'end')}
                                        disabled={!canPerformAction(zone.endRequests, getSessionId(), 'end').canPerform}
                                    >
                                        {ACTION_LABELS.end} ({zone.endRequests.length}/5)
                                    </button>
                                </div>

                                <div className="action-descriptions">
                                    <small>
                                        <strong>تأكيد:</strong> تأكيد وجود الخطر<br />
                                        <strong>بلاغ:</strong> معلومات خاطئة (ليس خطر)<br />
                                        <strong>انتهاء:</strong> الخطر انتهى وأصبح آمن
                                    </small>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};
export default MapComponent;