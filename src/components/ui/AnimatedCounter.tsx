'use client'

import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

interface Props {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2.5, decimals = 0 }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <span ref={ref}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          useEasing
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  )
}
