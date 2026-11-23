import React, { useEffect } from 'react';
import { Card } from '../../components/Card';
import { Bell, CheckCircle2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Notifications | Wenyfour';
  }, []);

  const notifications = [
    {
      id: '1',
      title: 'Welcome to Wenyfour',
      message: 'Find rides across Nigeria or publish trips to start earning today.',
      time: 'Just now',
      read: false,
    },
    {
      id: '2',
      title: 'Verification Requirement',
      message: 'Remember to verify your National Identification Number (NIN) to book and publish trips.',
      time: '1 hour ago',
      read: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Trip confirmations, alerts, and system notices</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <Card
            key={item.id}
            className={`p-4 transition-all ${
              !item.read ? 'border-brand-300 bg-brand-50/20' : 'bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  !item.read ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                  <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{item.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
