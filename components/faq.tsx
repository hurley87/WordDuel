import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I create a duel?</AccordionTrigger>
        <AccordionContent>
          You can create or accept a duel from the home page.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          How do I accept an invitation to duel?
        </AccordionTrigger>
        <AccordionContent>
          Each time you make a move, {`you'll`} need to deposit 5 times the
          amount
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I play?</AccordionTrigger>
        <AccordionContent>
          The game is played by guessing a secret 5 letter word.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>
          How does ETH in each game get distributed?
        </AccordionTrigger>
        <AccordionContent>
          Yes. animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default FAQ;
