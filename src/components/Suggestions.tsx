import React from 'react'

interface Props {
  text: string
}

type Ref = HTMLDivElement

const styles = {
  wrapper: {
    width: 100,
    border: '1px solid #cccccc'
  },
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
        <li style={styles.listItem}>Item 1</li>
        <li style={styles.listItem}>Item 2</li>
        <li style={styles.listItem}>Item 3</li>
        <li style={styles.listItem}>Item 4</li>
      </ul>
    </div>
  )
})

Suggestions.displayName = 'Suggestions'

export default Suggestions
