import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">ケモノピアへようこそ！</h1>
      <p className="text-xl mb-8">着ぐるみグリーティングイベントの世界を体験しよう</p>
      <Button size="lg">
        イベントを探す
      </Button>
    </section>
  );
}