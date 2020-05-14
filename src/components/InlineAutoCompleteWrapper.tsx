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
  const wrapperRef = useRef<HTMLDivElement>(null)
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.style.top = '0px'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.style.left = '0px'
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shadowInputRef.current!.wrapper!.style.zIndex = '-1'
    }

    if (
      suggestionsRef &&
      suggestionsRef.current &&
      shadowInputRef &&
      shadowInputRef.current &&
      wrapperRef &&
      wrapperRef.current
    ) {
      if (caretStart !== null && caretEnd !== null) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        const caretRect = shadowInputRef.current.caret?.getBoundingClientRect()
        if (wrapperRect && caretRect) {
          const topDiff = caretRect.top - wrapperRect.top
          const leftDiff = caretRect.left - wrapperRect.left

          suggestionsRef.current.style.top = `${topDiff + caretRect.height + 2}px`
          suggestionsRef.current.style.left = `${leftDiff}px`
        }
      }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const match = triggerRegex.exec(e.currentTarget.value)
    if (match) {
      console.log('match', match)
      setCaretStart(match.index)
      setCaretEnd(match.index + match[1].length)
    } else {
      setCaretStart(null)
      setCaretEnd(null)
    }
  }

  return (
    <div style={styles.wrapper} ref={wrapperRef}>
      <props.children.type {...props.children.props} ref={inputEl} onChange={handleOnChange} />
      <ShadowInput ref={shadowInputRef} text={text} positionIndex={caretStart} />
      {!!caretStart && !!caretEnd && <Suggestions ref={suggestionsRef} text={text} />}
    </div>
  )
}

export default InlineAutoCompleteWrapper
