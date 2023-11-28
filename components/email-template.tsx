import * as React from 'react';

interface EmailTemplateProps {
  content: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  content,
}) => (
  <div className="whitespace-pre-wrap text-black">
    <div>{content}</div>
    <br />
    <div>If you have any questions, please reply to this email.</div>
  </div>
);
