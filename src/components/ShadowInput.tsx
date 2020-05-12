import React, { useImperativeHandle, useRef } from 'react'

export interface ShadowInputRef {
  wrapper: HTMLDivElement | null
  caret: HTMLSpanElement | null
}

interface Props {
  text: string
  positionIndex: number | null
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

  const textBeforePositionIndicator = (): string => {
    if (props.positionIndex !== null) {
      return props.text.substring(0, props.positionIndex)
    }
    return ''
  }

  const textForPositionIndicator = (): string => {
    if (props.positionIndex !== null) {
      return props.text.substring(props.positionIndex, props.positionIndex + 1)
    }
    return ''
  }

  const textAfterPositionIndicator = (): string => {
    if (props.positionIndex !== null) {
      return props.text.substring(props.positionIndex + 1)
    }
    return ''
  }

  if (props.positionIndex === null) {
    return <div ref={divRef}>{props.text}</div>
  }

  return (
    <div ref={divRef}>
      {textBeforePositionIndicator()}
      <span ref={caratRef}>{textForPositionIndicator()}</span>
      {textAfterPositionIndicator()}
    </div>
  )
})

ShadowInput.displayName = 'ShadowInput'

export default ShadowInput
