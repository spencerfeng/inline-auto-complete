import React, { useRef, useEffect, useState } from 'react'
import ShadowInput, { ShadowInputRef } from './ShadowInput'
import Suggestions from './Suggestions'

const escapeRegex = (str: string): string => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

const getTriggerRegex = (trigger: string): RegExp => {
  const escapedTriggerChar = escapeRegex(trigger)
  return new RegExp(`(?:^|\\s)(${escapedTriggerChar}([^${escapedTriggerChar}\\s]*))$`)
}

interface CompProps {
  children: JSX.Element // we only allow a single JSX element as the children
  trigger: string
}

// reference: how to fix this issue: Type 'string' is not assignable to type '“inherit” | “initial” | “unset” | “fixed” | “absolute” | “static” | “relative” | “sticky”
// https://html.developreference.com/article/13298780/
const styles = {
  wrapper: {
    display: 'inline-block',
    position: 'relative'
  } as React.CSSProperties
}

const InlineAutoCompleteWrapper: React.FC<CompProps> = (props: CompProps) => {
  const triggerRegex = getTriggerRegex(props.trigger)
  const [text, setText] = useState('')
  const [caretStart, setCaretStart] = useState<number | null>(null)
  const [caretEnd, setCaretEnd] = useState<number | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inputEl = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const shadowInputRef = useRef<ShadowInputRef>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isInputElAvailable = inputEl && inputEl.current
    const isShadowInputWrapperAvailable = shadowInputRef && shadowInputRef.current && shadowInputRef.current.wrapper
    if (isInputElAvailable && isShadowInputWrapperAvailable) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const inputStyle = getComputedStyle(inputEl.current!)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.style.cssText += inputStyle.cssText
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.style.position = 'absolute'
      // shadowInputRef.current.style.top = '0px'
      // shadowInputRef.current.style.left = '0px'
    }
  })

  const handleOnChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setText(e.currentTarget.value)

    const inputScrollTop = inputEl.current?.scrollTop
    const isShadowInputWrapperAvailable = shadowInputRef.current && shadowInputRef.current.wrapper

    if (inputScrollTop && isShadowInputWrapperAvailable) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.scrollTop = inputScrollTop
    }

    if (shadowInputRef.current && shadowInputRef.current.caret) {
      console.log('shadowInputRef.current.caret', shadowInputRef.current.caret)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const match = triggerRegex.exec(e.currentTarget.value)
    if (match) {
      console.log('match', match)
      setCaretStart(match.index)
      setCaretEnd(match.index + match[1].length)
    }
  }

  return (
    <div style={styles.wrapper}>
      <props.children.type {...props.children.props} ref={inputEl} onChange={handleOnChange} />
      <ShadowInput ref={shadowInputRef} text={text} positionIndex={caretStart} />
      <Suggestions ref={suggestionsRef} text={text} />
    </div>
  )
}

export default InlineAutoCompleteWrapper
