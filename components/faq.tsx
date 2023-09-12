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
        <AccordionTrigger className="font-black">
          How do I create a duel?
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          To create a duel you must declare the email of your opponent and the
          amount of ETH you want to spend on each guess.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-black">
          How do I accept an invitation to duel?
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          Only the person with the declared email can accept the duel. They will
          need to fund their account with ETH to play.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-black">
          How do I play?
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          Each player takes turns guessing a word. Each time a player guesses a
          word, they add ETH to the pot.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="font-black">
          How does ETH in each game get distributed?
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          The player who guesses the right word first wins the duel and the
          entire pot. If no one guesses the right word, the duel ends in a draw
          and the pot is split.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default FAQ;
