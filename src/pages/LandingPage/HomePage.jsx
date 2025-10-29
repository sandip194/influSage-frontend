import React from 'react'
import { Header } from './chunks/Header'
import { HeroSection } from './chunks/HeroSection'
import { HowItWorksSection } from './chunks/HowItWorksSection'
import { SuccessSection } from './chunks/SuccessSection'
import { TrustedSection } from './chunks/TrustedSection'
import { CTASection } from './chunks/CTASection'
import { Footer } from './chunks/Footer'

const HomePage = () => {
    return (
        <div className='bg-gray-50 flex flex-col'>
            <Header />
            <main className='flex-grow'>
                <HeroSection />
                <SuccessSection />
                <HowItWorksSection />
                <TrustedSection />
                <CTASection />

            </main>

            <Footer />
        </div>
    )
}

export default HomePage