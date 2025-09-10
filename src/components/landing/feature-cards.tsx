'use client';
import { motion } from 'framer-motion';
import { Bot, Gauge, SearchCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const features = [
  {
    icon: <SearchCheck className="h-8 w-8" />,
    title: 'Clause Analysis',
    description: 'Our AI dissects complex legal clauses, providing you with clear, easy-to-understand insights.',
  },
  {
    icon: <Gauge className="h-8 w-8" />,
    title: 'Risk Scoring',
    description: 'Get an instant risk score for each clause, helping you identify potential issues at a glance.',
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI Q&A Assistant',
    description: 'Ask any question about your contract and receive instant, context-aware answers.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function FeatureCards() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.2 }}
      className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3"
    >
      {features.map((feature, i) => (
        <motion.div key={feature.title} custom={i} variants={cardVariants}>
          <Card className="h-full transform-gpu bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {feature.description}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
