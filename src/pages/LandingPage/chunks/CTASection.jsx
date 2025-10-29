import { Button } from 'antd';

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 text-center bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
      <p className="mb-6 max-w-xl mx-auto text-sm">
        Join thousands of successful brands and creators. Start your journey today and discover the power of authentic influencer partnerships.
      </p>
      <div className="flex justify-center gap-4 max-w-xs mx-auto">
        <Button>Start as Brand</Button>
        <Button type="primary">Join as Creator</Button>
      </div>
    </section>
  );
}
