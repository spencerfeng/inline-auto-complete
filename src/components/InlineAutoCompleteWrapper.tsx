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
  suggestions: string[]
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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const shadowInputRef = useRef<ShadowInputRef>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const shouldShowSuggestions = (): boolean => caretStart !== null && caretEnd !== null

  useEffect(() => {
    if (inputRef?.current && shadowInputRef?.current?.wrapper) {
      const inputStyle = getComputedStyle(inputRef.current)
      shadowInputRef.current.wrapper.style.cssText += inputStyle.cssText
      shadowInputRef.current.wrapper.style.position = 'absolute'
      shadowInputRef.current.wrapper.style.top = '0px'
      shadowInputRef.current.wrapper.style.left = '0px'
      shadowInputRef.current.wrapper.style.zIndex = '-1'
    }

    if (suggestionsRef?.current && shadowInputRef?.current?.wrapper && wrapperRef?.current) {
      if (shouldShowSuggestions()) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        const caretRect = shadowInputRef.current.caret?.getBoundingClientRect()
        if (wrapperRect && caretRect) {
          const topDiff = caretRect.top - wrapperRect.top
          const leftDiff = caretRect.left - wrapperRect.left

          const lineHeightVal = parseFloat(shadowInputRef.current.wrapper.style.lineHeight)

          if (!isNaN(lineHeightVal)) {
            suggestionsRef.current.style.top = `${topDiff + lineHeightVal}px`
            suggestionsRef.current.style.left = `${leftDiff}px`
          }
        }
      }
    }
  })

  const setCaret = (text: string): void => {
    const match = triggerRegex.exec(text)
    if (match) {
      setCaretStart(match.index + 1)
      setCaretEnd(match.index + match[1].length)
    } else {
      setCaretStart(null)
      setCaretEnd(null)
    }
  }

  const handleOnChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setText(e.currentTarget.value)

    if (inputRef?.current?.scrollTop && shadowInputRef?.current?.wrapper) {
      shadowInputRef.current.wrapper.scrollTop = inputRef.current.scrollTop
    }

    setCaret(e.currentTarget.value)
  }

  const handleOnSelect = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (inputRef?.current) {
      const selectionStart = inputRef.current.selectionStart
      if (selectionStart) {
        setCaret(e.currentTarget.value.substring(0, selectionStart))
      }
    }
  }

  return (
    <div style={styles.wrapper} ref={wrapperRef}>
      <props.children.type
        {...props.children.props}
        ref={inputRef}
        onChange={handleOnChange}
        onSelect={handleOnSelect}
      />
      <ShadowInput ref={shadowInputRef} text={text} caretStart={caretStart} caretEnd={caretEnd} />
      {shouldShowSuggestions() && <Suggestions ref={suggestionsRef} suggestions={props.suggestions} />}
    </div>
  )
}

export default InlineAutoCompleteWrapper
