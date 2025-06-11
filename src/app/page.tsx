"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Code,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { SchedulerProvider } from "@/providers/schedular-provider";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const installCode = `# First, install shadcn UI in your project:
npx shadcn-ui@latest init

# Then clone the Mina Scheduler repository:
git clone https://github.com/Mina-Massoud/mina-scheduler

# Copy these folders to your project:
# - /types
# - /components/schedule
# - /providers`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen relative flex flex-col">
      <nav className="container px-4 mx-auto py-4 flex justify-between items-center">
        <div className="md:text-2xl font-bold text-primary ">
          Mina Scheduler
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/Mina-Massoud/mina-scheduler"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="mr-2 h-4 w-4" />
            Installation
          </Button>
        </div>
      </nav>

      <svg
        width="400"
        height="400"
        className="absolute lg:block hidden top-20 left-0"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <g clip-path="url(#clip0_104_26)">
          {" "}
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M107.143 0H92.8571V82.7556L34.3401 24.2385L24.2386 34.3401L82.7556 92.8571H0V107.143H82.7555L24.2386 165.66L34.3401 175.761L92.8571 117.244V200H107.143V117.244L165.66 175.761L175.761 165.66L117.244 107.143H200V92.8571H117.244L175.761 34.34L165.66 24.2385L107.143 82.7555V0Z"
            fill="url(#paint0_linear_104_26)"
          />{" "}
        </g>{" "}
        <defs>
          {" "}
          <linearGradient
            id="paint0_linear_104_26"
            x1="20.5"
            y1="16"
            x2="100"
            y2="200"
            gradientUnits="userSpaceOnUse"
          >
            {" "}
            <stop stop-color="#ACAAFF" />{" "}
            <stop offset="1" stop-color="#C0E8FF" />{" "}
          </linearGradient>{" "}
          <clipPath id="clip0_104_26">
            {" "}
            <rect width="200" height="200" fill="white" />{" "}
          </clipPath>{" "}
        </defs>{" "}
      </svg>

      <section className="flex-1 relative z-10 container mx-auto flex flex-col items-center justify-center px-4 py-12 md:py-24 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mina Scheduler Library
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground max-w-[700px] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A customizable and flexible calendar component for React that allows
          you to manage and display events in day, week, or month views.
        </motion.p>

        <motion.div
          className="w-full max-w-[700px] text-left mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Day, Week, Month Views:</strong> Switch between different
              calendar views with ease.
            </li>
            <li>
              <strong>Event Management:</strong> Add, update, and delete events
              with built-in form validation.
            </li>
            <li>
              <strong>Customizable UI:</strong> Easily customize the look and
              feel of the calendar.
            </li>
            <li>
              <strong>Mobile-Friendly:</strong> Responsive design optimized for
              mobile devices.
            </li>
            <li>
              <strong>Framer Motion Animations:</strong> Smooth transitions
              between views.
            </li>
            <li>
              <strong>Zod Validation:</strong> Schema validation for ensuring
              valid event data.
            </li>
            <li>
              <strong>Shadcn UI Integration:</strong> Leverages Shadcn UI for a
              seamless user interface.
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="lg" onClick={() => setShowCalendar(true)}>
            Show Me The Library
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowCode(!showCode)}
          >
            How To Install
          </Button>
        </motion.div>

        <AnimatePresence>
          {showCode && (
            <motion.div
              className="w-full max-w-[700px] bg-card border rounded-lg p-4 mb-8 relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <pre className="overflow-x-auto text-left p-4 bg-muted rounded">
                <code>{installCode}</code>
              </pre>
              <p className="text-left text-sm mt-4">
                Then import in your React component:
              </p>
              <pre className="overflow-x-auto text-left p-4 bg-muted rounded mt-2">
                <code>{`// In your component
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { SchedulerProvider } from "@/providers/schedular-provider";

export default function MyCalendar() {
  return (
    <SchedulerProvider weekStartsOn="monday">
      <SchedulerWrapper 
        stopDayEventSummary={true}
        classNames={{
          tabs: {
            panel: "p-0",
          },
        }}
      />
    </SchedulerProvider>
  )
}`}</code>
              </pre>
              <h3 className="text-left font-medium mt-6 mb-2">Step-by-step:</h3>
              <ol className="text-left text-sm list-decimal ml-5 space-y-2">
                <li>
                  <a
                    href="https://ui.shadcn.com/docs/installation"
                    target="_blank"
                    className="text-primary underline"
                  >
                    Install shadcn UI
                  </a>{" "}
                  in your React/Next.js project
                </li>
                <li>
                  Clone the{" "}
                  <a
                    href="https://github.com/Mina-Massoud/mina-scheduler"
                    target="_blank"
                    className="text-primary underline"
                  >
                    Mina Scheduler repository
                  </a>
                </li>
                <li>
                  for detailed documentation, visit the{" "}
                  <a
                    href="https://github.com/Mina-Massoud/mina-scheduler"
                    target="_blank"
                    className="text-primary underline"
                  >
                    repository page
                  </a>
                </li>
                <li>
                  Copy these folders to your project:
                  <ul className="list-disc ml-5 mt-1">
                    <li>
                      <code className="bg-muted px-1 rounded text-xs">
                        /types
                      </code>{" "}
                      folder with event and scheduler types
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded text-xs">
                        /components/schedule
                      </code>{" "}
                      folder with calendar components
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded text-xs">
                        /providers
                      </code>{" "}
                      folder with context providers
                    </li>
                  </ul>
                </li>
                <li>Import and use as shown in the example above</li>
                <li>
                  Contact with me on{" "}
                  <a
                    href="https://mina-massoud.com"
                    target="_blank"
                    className="text-primary underline"
                  >
                    mina-massoud.com
                  </a>{" "}
                  <span className="inline-block animate-bounce">🚀</span>
                </li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border rounded-lg w-full max-w-[1500px] max-h-[95vh] overflow-auto"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold">Mina Scheduler Demo</h2>
                <Button variant="ghost" size="sm">
                  Close
                </Button>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-4"
              >
                <SchedulerWrapper
                  stopDayEventSummary={true}
                  classNames={{
                    tabs: {
                      panel: "p-0",
                    },
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} Mina Scheduler. Open source under
                MIT License.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/Mina-Massoud" target="_blank">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.linkedin.com/in/mina-melad/"
                  target="_blank"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:minamelad232@gmail.com">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1"
                asChild
              >
                <Link href="https://mina-massoud.com" target="_blank">
                  <span>Contact Me</span>{" "}
                  <span className="text-lg ml-1">🚀</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
