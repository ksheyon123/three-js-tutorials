import React from "react";

interface IProps {
  text: string;
}

const Code: React.FC<IProps> = ({ text }) => {
  return (
    <pre>
      <code>{text}</code>
    </pre>
  );
};

export { Code };
