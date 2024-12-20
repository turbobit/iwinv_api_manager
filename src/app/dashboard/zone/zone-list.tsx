'use client';

import { useEffect, useState } from 'react';
import { useResource } from '@/contexts/resource-context';

interface Zone {
    content: string[];
    status: string;
    zone_id: string;
    zone_name: string;
}

interface ZoneResponse {
    result: Zone[];
}

export function ZoneList() {
    const [zones, setZones] = useState<Zone[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedZone, setSelectedZone } = useResource();

    useEffect(() => {
        let isMounted = true;

        const fetchZones = async () => {
            try {
                const response = await fetch('/api/zones', {
                    credentials: 'include',
                });

                if (!isMounted) return;

                if (response.status === 429) {
                    const data = await response.json();
                    setError(`Rate limit 초과: ${data.error}`);
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch zones');
                }

                const data: ZoneResponse = await response.json();
                
                if (isMounted) {
                    if (data.result.length === 0) {
                        setError('데이터 없음');
                    } else {
                        setZones(data.result);
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
                    setIsLoading(false);
                }
            }
        };

        fetchZones();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleZoneClick = (zone: Zone) => {
        setSelectedZone(selectedZone === zone.zone_id ? null : zone.zone_id);
    };

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div className="text-red-500">에러: {error}</div>;

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
                <div
                    key={zone.zone_id}
                    className={`p-4 border rounded shadow cursor-pointer transition-all duration-200 ${
                        selectedZone === zone.zone_id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                            : 'hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleZoneClick(zone)}
                >
                    <div className="flex justify-between items-start">
                        <h2 className="font-bold">{zone.zone_name}</h2>
                        {selectedZone === zone.zone_id && (
                            <span className="text-blue-500 text-sm font-semibold">
                                선택됨
                            </span>
                        )}
                    </div>
                    <div className="text-gray-600">
                        {zone.content.map((item, index) => (
                            <p key={index} className="text-sm">
                                {item}
                            </p>
                        ))}
                    </div>
                    <p className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-sm ${
                            zone.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {zone.status}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    );
} 