import React from 'react'

interface Props {
  text: string
}

type Ref = HTMLDivElement

const Suggestions = React.forwardRef<Ref, Props>((props: Props, ref) => {
  return <div ref={ref}>{props.text}</div>
})

Suggestions.displayName = 'Suggestions'

export default Suggestions
