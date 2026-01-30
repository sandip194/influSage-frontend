import { Button } from 'antd';
import { RiRocketLine } from '@remixicon/react';

export function CTASection() {
  return (
    <section className="relative px-6 py-24 text-center overflow-hidden bg-[#0D132D] text-white">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#335CFF]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#335CFF]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      {/* Content */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#335CFF]/10 border border-[#335CFF]/20 text-sm font-medium backdrop-blur-md">
          <RiRocketLine className="text-[#FFD23F]" size={18} />
          <span>Launch Your First Campaign Today</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
          Ready to Transform Your Marketing?
        </h2>

        <p className="max-w-2xl mx-auto text-[#FFFFFFB3] text-lg leading-relaxed">
          Join thousands of successful brands and creators. Start your journey today and
          discover the power of authentic influencer partnerships.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            type="primary"
            size="large"
            className="!bg-[#335CFF] !border-none !text-white !font-semibold hover:!bg-[#2A4ED1] transition-all duration-300"
          >
            Start as Brand
          </Button>
          <Button
            ghost
            size="large"
            className="!text-[#335CFF] !border-[#335CFF]/40 hover:!bg-[#335CFF]/10 transition-all duration-300"
          >
            Join as Creator
          </Button>
        </div>
      </div>
    </section>

  );
}
