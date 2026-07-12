

interface SplitTextRevealProps {
  text: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  style?: React.CSSProperties
  stagger?: number
  duration?: number
  trigger?: 'scroll' | 'load'
  delay?: number
}

export default function SplitTextReveal({
  text,
  tag: Tag = 'h2',
  className,
  style,
}: SplitTextRevealProps) {
  return (
    <Tag
      className={className}
      style={style}
    >
      {text}
    </Tag>
  )
}
