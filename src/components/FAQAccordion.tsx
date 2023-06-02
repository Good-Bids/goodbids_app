import React, { ReactNode, Ref, RefObject } from "react";
import classNames from "classnames";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { faq } from "~/utils/constants";

export const FAQAccordion = () => (
  <div className="mt-4 flex w-full flex-col items-stretch gap-1">
    <p className="text-4xl font-black text-bottleGreen">
      Frequently Asked Questions
    </p>
    {faq.map((faqSubject) => (
      <>
        <p className="mt-2 text-2xl font-bold text-bottleGreen">
          {faqSubject.subject}
        </p>
        <Accordion.Root
          className="bg-mauve6 flex w-full flex-col items-stretch rounded-md shadow-[0_2px_10px] shadow-black/5"
          type="single"
          defaultValue="item-1"
          collapsible
        >
          {faqSubject.questions.map((question, index) => (
            <AccordionItem value={`value-${index + 1}`} key={question.question}>
              <AccordionTrigger>{question.question}</AccordionTrigger>
              <AccordionContent className="w-full">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion.Root>
      </>
    ))}
  </div>
);

interface AccordionItemProps {
  children: ReactNode[] | ReactNode;
  value: string;
  className?: string;
}

const AccordionItem = React.forwardRef<{}, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        "focus-within:shadow-mauve12 mt-px w-full overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]",
        className
      )}
      {...props}
      ref={forwardedRef as RefObject<HTMLDivElement>}
    >
      {children}
    </Accordion.Item>
  )
);

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

const AccordionTrigger = React.forwardRef<{}, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex w-full">
      <Accordion.Trigger
        className={classNames(
          "hover:bg-mauve2 group flex h-[45px] min-h-[45px] w-full flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none text-bottleGreen shadow-[0_1px_0] shadow-pompadour outline-none",
          className
        )}
        {...props}
        ref={forwardedRef as Ref<HTMLButtonElement>}
      >
        {children}
        <ChevronDownIcon
          className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionContent = React.forwardRef<{}, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        "text-mauve11 bg-mauve2 w-full overflow-hidden text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
        className
      )}
      {...props}
      ref={forwardedRef as RefObject<HTMLDivElement>}
    >
      <div className="px-5 py-[15px]">{children}</div>
    </Accordion.Content>
  )
);
