
interface ButtonProps {
  onClick: (arg0: unknown) => void,
  text: string,
  color: string,
  textColor: string,
}

export const Button = ({ text, onClick, color }: ButtonProps) => {




  return <button className={`container bg-${color}`}>{text}</button>
}