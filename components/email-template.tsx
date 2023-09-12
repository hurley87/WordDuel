import * as React from 'react';

interface EmailTemplateProps {
  content: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  content,
}) => <div className="whitespace-pre-wrap text-black">{content}</div>;
