import React, { useImperativeHandle, useRef } from 'react'

export interface ShadowInputRef {
  wrapper: HTMLDivElement | null
  caret: HTMLSpanElement | null
}

interface Props {
  text: string
}

const ShadowInput = React.forwardRef<ShadowInputRef, Props>((props: Props, ref) => {
  const divRef = useRef<HTMLDivElement>(null)
  const caratRef = useRef<HTMLSpanElement>(null)

  useImperativeHandle(ref, () => ({
    get wrapper(): HTMLDivElement | null {
      return divRef.current
    },
    get caret(): HTMLSpanElement | null {
      return caratRef.current
    }
  }))

  return (
    <div ref={divRef}>
      <span ref={caratRef}>{props.text}</span>
    </div>
  )
})

ShadowInput.displayName = 'ShadowInput'

export default ShadowInput
