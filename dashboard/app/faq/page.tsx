"use client"

import type React from "react"
import { EAPTransactionChecker } from "@/components/eap/eap-transaction-checker"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItem {
  id: string
  question: string
  answer: string | React.ReactNode
}

const faqItems: FaqItem[] = [
  {
    id: "eap-not-showing",
    question: "I paid for Early Access Program, but it's still not showing up?",
    answer: (
      <div className="space-y-4">
        <p>
          It usually takes 5-30 seconds for the EAP to be granted to your account. If the EAP is not granted, please
          paste your transaction hash into the transaction checker below.
        </p>
        <EAPTransactionChecker />
      </div>
    ),
  },
  {
    id: "export-embedded-wallet",
    question: "Can I export my embedded wallet?",
    answer: (
      <div className="space-y-4">
        <p>
          Unfortunately, to ensure a maximum level of security, we currently do not support exporting your embedded
          wallet. We will be integrating with famous Embedded Wallet providers soon so you can have absolute control
          over your wallet.
        </p>
      </div>
    ),
  },
  {
    id: "discord-eap-verification",
    question: "How can I become EAP Verified in Discord?",
    answer: (
      <div className="space-y-4">
        <p>To become EAP Verified in Discord:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>On the bottom left, tap your wallet</li>
          <li>Tap `Account`</li>
          <li>Find the `Connect` button next to Discord and tap on it</li>
          <li>Connect to the Discord server</li>
        </ol>
        <p>
          Once completed, you should now be `EAP VERIFIED` and see custom Discord channels for EAP users. Your name will
          also be color differentiated from other users.
        </p>
      </div>
    ),
  },
]

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col py-8">
        <div className="w-full px-8">
          <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
        </div>
      </div>

      <Accordion type="single" collapsible className="mx-8 mb-8">
        {faqItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

