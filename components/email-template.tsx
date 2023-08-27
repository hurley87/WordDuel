import * as React from 'react';

interface EmailTemplateProps {
  text: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  text,
}) => <div className="whitespace-pre-wrap text-black">{text}</div>;
