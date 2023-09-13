import * as React from 'react';

interface EmailTemplateProps {
  content: string;
  cc: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  content,
  cc,
}) => (
  <div className="whitespace-pre-wrap text-black">
    <div>{content}</div>
    <p>cc: {cc}</p>
  </div>
);
