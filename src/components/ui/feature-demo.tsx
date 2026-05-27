'use client';
import React from 'react';
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

const features = [
	{
		title: 'Architectural Rendering',
		icon: Sparkles,
		description: 'High-fidelity cinematic visual representations of skyscrapers, residential complexes, and modern structural shapes.',
	},
	{
		title: 'Interior Design CGI',
		icon: Settings2,
		description: 'Photorealistic light propagation setups and bespoke material simulations for residential and hospitality environments.',
	},
	{
		title: 'Product Visualization',
		icon: Fingerprint,
		description: 'Intricately crafted studio mockups and product renders emphasizing high-end material textures and digital light reflections.',
	},
	{
		title: 'Landscape Environments',
		icon: Pencil,
		description: 'Stunning organic sculpting, foliage layouts, and terrain configurations optimized for environmental masterplans.',
	},
	{
		title: 'Marketing Videos & CGI',
		icon: Cpu,
		description: 'Engaging, high-impact marketing videos, commercial walkthroughs, promo animations, and dynamic social media reels.',
	},
	{
		title: 'Interactive 3D Assets',
		icon: Zap,
		description: 'Custom polygon structures engineered carefully to load instantly and behave beautifully on modern browser systems.',
	},
];

export default function DemoOne({ onEnterAssets }: { onEnterAssets?: () => void }) {
	return (
		<section id="features" className="py-24 md:py-32 w-full relative select-none">
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
			<div className="mx-auto w-full max-w-6xl space-y-16 px-4 relative z-10">
				<AnimatedContainer className="mx-auto max-w-3xl text-center">
					<div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-sm font-medium mb-6 backdrop-blur-md">
						<Sparkles className="w-4 h-4 mr-2 text-white" />
						Visual 3D Gallery
					</div>
					<h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl text-white">
						Form. Space. <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600">Visualization.</span>
					</h2>
					<p className="text-neutral-400 mt-6 text-base md:text-lg tracking-wide text-balance max-w-2xl mx-auto font-light leading-relaxed">
						Explore high-fidelity 3D assets, digital site reconstructions, and photorealistic spatial renderings meticulously optimized for clients, developers, and product creators.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.2}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>

				{onEnterAssets && (
					<AnimatedContainer delay={0.3} className="flex justify-center pt-4">
						<button
							type="button"
							onClick={onEnterAssets}
							className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] cursor-pointer text-sm group"
						>
							<Zap className="w-4 h-4 text-black animate-pulse" />
							<span>Access Live 3D Assets Hub</span>
							<span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs ml-1 group-hover:translate-x-0.5 transition-transform font-mono">→</span>
						</button>
					</AnimatedContainer>
				)}
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(10px)', y: 20, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ delay, duration: 0.8, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
