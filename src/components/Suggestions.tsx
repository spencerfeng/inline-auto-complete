import React from 'react'

interface Props {
  suggestions: string[]
}

type Ref = HTMLDivElement

const styles = {
  wrapper: {
    width: 100,
    border: '1px solid #cccccc',
    position: 'absolute'
  } as React.CSSProperties,
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'left'
  } as React.CSSProperties,
  listItem: {
    padding: '5px 15px'
  }
}

const Suggestions = React.forwardRef<Ref, Props>((props: Props, ref) => {
  return (
    <div ref={ref} style={styles.wrapper}>
      <ul style={styles.list}>
        {props.suggestions.map((suggestion) => (
          <li style={styles.listItem} key={suggestion}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
})

Suggestions.displayName = 'Suggestions'

export default Suggestions
