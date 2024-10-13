"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call to Supabase
    const mockEvents: Event[] = [
      { id: 1, title: "ケモノピア夏祭り", date: "2024-07-15", location: "東京ドーム" },
      { id: 2, title: "ふわふわ動物園", date: "2024-08-20", location: "横浜アリーナ" },
      { id: 3, title: "もふもふパレード", date: "2024-09-10", location: "大阪城ホール" },
    ];
    setEvents(mockEvents);
  }, []);

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6 text-center">upcoming events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">日付: {event.date}</p>
              <p className="mb-4">場所: {event.location}</p>
              <Button>詳細を見る</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}